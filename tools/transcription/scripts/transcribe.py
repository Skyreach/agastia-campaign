#!/usr/bin/env python3
"""
Audio Transcription Tool with Speaker Diarization
Uses WhisperX for transcription and pyannote for speaker identification
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import whisperx


class TranscriptionService:
    """Handle audio transcription with speaker diarization"""

    def __init__(self, hf_token: Optional[str] = None, device: str = "cpu", compute_type: str = "int8"):
        """
        Initialize transcription service

        Args:
            hf_token: HuggingFace API token for speaker diarization
            device: Device to use (cpu or cuda)
            compute_type: Compute type (int8, float16, float32)
        """
        self.hf_token = hf_token
        self.device = device
        self.compute_type = compute_type
        self.model = None

    def load_model(self, model_name: str = "base"):
        """
        Load WhisperX model

        Args:
            model_name: Model size (tiny, base, small, medium, large-v2)
        """
        print(f"Loading Whisper model '{model_name}' on {self.device}...")
        self.model = whisperx.load_model(
            model_name,
            self.device,
            compute_type=self.compute_type
        )

    def transcribe_audio(
        self,
        audio_path: str,
        language: Optional[str] = None,
        batch_size: int = 16
    ) -> Dict:
        """
        Transcribe audio file with speaker diarization

        Args:
            audio_path: Path to audio file
            language: Language code (e.g., 'en', 'es') or None for auto-detect
            batch_size: Batch size for processing

        Returns:
            Dictionary containing transcription results
        """
        if not self.model:
            self.load_model()

        print(f"\nTranscribing: {audio_path}")
        print("Step 1/4: Running Whisper transcription...")

        # Step 1: Transcribe with Whisper
        audio = whisperx.load_audio(audio_path)
        result = self.model.transcribe(audio, batch_size=batch_size, language=language)

        print(f"Detected language: {result.get('language', 'unknown')}")

        # Step 2: Align whisper output
        print("Step 2/4: Aligning timestamps...")
        model_a, metadata = whisperx.load_align_model(
            language_code=result["language"],
            device=self.device
        )
        result = whisperx.align(
            result["segments"],
            model_a,
            metadata,
            audio,
            self.device,
            return_char_alignments=False
        )

        # Step 3: Speaker diarization (if HF token provided)
        if self.hf_token:
            print("Step 3/4: Identifying speakers...")
            try:
                # Using community-maintained model (actively updated)
                diarize_model = whisperx.DiarizationPipeline(
                    model_name="pyannote/speaker-diarization-community-1",
                    use_auth_token=self.hf_token,
                    device=self.device
                )
                diarize_segments = diarize_model(audio)
                result = whisperx.assign_word_speakers(diarize_segments, result)
                print(f"Identified {len(set(s.get('speaker', 'UNKNOWN') for s in result['segments']))} speakers")
            except Exception as e:
                print(f"Warning: Speaker diarization failed: {e}")
                print("Continuing without speaker labels...")
        else:
            print("Step 3/4: Skipping speaker diarization (no HuggingFace token)")

        print("Step 4/4: Finalizing results...")

        return result


class TranscriptFormatter:
    """Format transcription results into different output formats"""

    @staticmethod
    def to_json(result: Dict, audio_file: str) -> str:
        """Format as JSON with full metadata"""
        output = {
            "metadata": {
                "audio_file": audio_file,
                "timestamp": datetime.now().isoformat(),
                "language": result.get("language", "unknown"),
                "num_segments": len(result.get("segments", []))
            },
            "segments": result.get("segments", [])
        }
        return json.dumps(output, indent=2, ensure_ascii=False)

    @staticmethod
    def to_markdown(result: Dict, audio_file: str) -> str:
        """Format as Markdown with speaker headers"""
        lines = [
            f"# Transcript: {Path(audio_file).name}",
            f"",
            f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"**Language:** {result.get('language', 'unknown')}",
            f"",
            "---",
            ""
        ]

        current_speaker = None
        for segment in result.get("segments", []):
            speaker = segment.get("speaker", "Unknown")
            start_time = segment.get("start", 0)
            end_time = segment.get("end", 0)
            text = segment.get("text", "").strip()

            # Add speaker header if changed
            if speaker != current_speaker:
                current_speaker = speaker
                lines.append(f"\n## {speaker}")
                lines.append("")

            # Add timestamped text
            timestamp = f"[{start_time:.2f}s - {end_time:.2f}s]"
            lines.append(f"**{timestamp}** {text}")

        return "\n".join(lines)

    @staticmethod
    def to_txt(result: Dict) -> str:
        """Format as plain text with speaker labels"""
        lines = []

        for segment in result.get("segments", []):
            speaker = segment.get("speaker", "Unknown")
            start_time = segment.get("start", 0)
            text = segment.get("text", "").strip()

            lines.append(f"[{start_time:.1f}s] {speaker}: {text}")

        return "\n".join(lines)


def load_hf_token() -> Optional[str]:
    """Load HuggingFace token from config file"""
    config_file = Path(__file__).parent.parent / "config" / "hf_token.txt"

    if config_file.exists():
        return config_file.read_text().strip()
    return None


def save_outputs(result: Dict, audio_file: str, output_dir: Path):
    """Save transcription in all formats"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_name = Path(audio_file).stem
    output_base = output_dir / f"{base_name}_{timestamp}"

    formatter = TranscriptFormatter()

    # JSON output
    json_file = output_base.with_suffix(".json")
    json_file.write_text(formatter.to_json(result, audio_file), encoding="utf-8")
    print(f"✓ Saved JSON: {json_file}")

    # Markdown output
    md_file = output_base.with_suffix(".md")
    md_file.write_text(formatter.to_markdown(result, audio_file), encoding="utf-8")
    print(f"✓ Saved Markdown: {md_file}")

    # Text output
    txt_file = output_base.with_suffix(".txt")
    txt_file.write_text(formatter.to_txt(result), encoding="utf-8")
    print(f"✓ Saved Text: {txt_file}")

    return {
        "json": str(json_file),
        "markdown": str(md_file),
        "text": str(txt_file)
    }


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Transcribe audio with speaker diarization using WhisperX"
    )
    parser.add_argument(
        "audio_file",
        help="Path to audio file (MP3, WAV, etc.)"
    )
    parser.add_argument(
        "--model",
        default="base",
        choices=["tiny", "base", "small", "medium", "large-v2"],
        help="Whisper model size (default: base)"
    )
    parser.add_argument(
        "--language",
        help="Language code (e.g., 'en', 'es') or auto-detect if not specified"
    )
    parser.add_argument(
        "--device",
        default="cpu",
        choices=["cpu", "cuda"],
        help="Device to use (default: cpu)"
    )
    parser.add_argument(
        "--output-dir",
        help="Output directory (default: ../outputs/)"
    )
    parser.add_argument(
        "--hf-token",
        help="HuggingFace token for speaker diarization"
    )
    parser.add_argument(
        "--no-diarization",
        action="store_true",
        help="Skip speaker diarization"
    )

    args = parser.parse_args()

    # Validate audio file
    audio_path = Path(args.audio_file)
    if not audio_path.exists():
        print(f"Error: Audio file not found: {audio_path}", file=sys.stderr)
        sys.exit(1)

    # Setup output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        output_dir = Path(__file__).parent.parent / "outputs"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Get HuggingFace token
    hf_token = None
    if not args.no_diarization:
        hf_token = args.hf_token or load_hf_token()
        if not hf_token:
            print("Warning: No HuggingFace token found. Proceeding without speaker diarization.")
            print("To enable speaker diarization, either:")
            print("  1. Pass --hf-token YOUR_TOKEN")
            print("  2. Save token to: tools/transcription/config/hf_token.txt")

    # Initialize service
    service = TranscriptionService(
        hf_token=hf_token,
        device=args.device,
        compute_type="int8" if args.device == "cpu" else "float16"
    )

    try:
        # Transcribe
        result = service.transcribe_audio(
            str(audio_path),
            language=args.language
        )

        # Save outputs
        print("\nSaving outputs...")
        files = save_outputs(result, str(audio_path), output_dir)

        print("\n✅ Transcription complete!")
        print(f"\nOutput files:")
        for format_type, file_path in files.items():
            print(f"  {format_type:8s}: {file_path}")

    except Exception as e:
        print(f"\n❌ Error during transcription: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
