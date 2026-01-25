#!/usr/bin/env python3
"""
Interactive Session Transcript Processor
Handles full workflow: recording → transcription → speaker mapping → Notion upload
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))
from transcribe import TranscriptionService, TranscriptFormatter


class SessionTranscriptProcessor:
    """Manages the full transcript processing workflow"""

    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.recordings_dir = base_dir / "recordings"
        self.transcripts_dir = base_dir.parent.parent / "campaign-content" / "Transcripts"
        self.state_file = base_dir / "processed_recordings.json"

        # Ensure directories exist
        self.transcripts_dir.mkdir(parents=True, exist_ok=True)

    def load_state(self) -> Dict:
        """Load processing state"""
        if self.state_file.exists():
            return json.loads(self.state_file.read_text())
        return {"_schema_version": "1.0", "recordings": {}}

    def save_state(self, state: Dict):
        """Save processing state"""
        self.state_file.write_text(json.dumps(state, indent=2, ensure_ascii=False))

    def scan_recordings(self, campaign: Optional[str] = None) -> List[Dict]:
        """
        Scan for audio recordings

        Returns list of {path, campaign, filename, processed}
        """
        state = self.load_state()
        recordings = []

        # Scan campaign folders
        for campaign_dir in self.recordings_dir.iterdir():
            if not campaign_dir.is_dir():
                continue

            # Skip if specific campaign requested and this isn't it
            if campaign and campaign_dir.name != campaign:
                continue

            # Scan for audio files
            for audio_file in campaign_dir.iterdir():
                if audio_file.suffix.lower() in ['.mp3', '.wav', '.m4a', '.ogg', '.flac']:
                    relative_path = str(audio_file.relative_to(self.recordings_dir))
                    is_processed = relative_path in state.get("recordings", {})

                    recordings.append({
                        "path": str(audio_file),
                        "relative_path": relative_path,
                        "campaign": campaign_dir.name,
                        "filename": audio_file.name,
                        "processed": is_processed,
                        "size_mb": audio_file.stat().st_size / (1024 * 1024)
                    })

        return sorted(recordings, key=lambda x: (x["processed"], x["campaign"], x["filename"]))

    def select_recording(self, campaign: Optional[str] = None) -> Optional[Dict]:
        """Interactive recording selection"""
        recordings = self.scan_recordings(campaign)

        if not recordings:
            if campaign:
                print(f"No recordings found in {self.recordings_dir / campaign}")
            else:
                print(f"No recordings found in {self.recordings_dir}")
            print("\nPlace audio files in:")
            print(f"  - {self.recordings_dir}/agastia/")
            print(f"  - {self.recordings_dir}/ravnica/")
            return None

        # Show unprocessed first
        unprocessed = [r for r in recordings if not r["processed"]]
        processed = [r for r in recordings if r["processed"]]

        print("\n" + "=" * 60)
        print("Available Recordings")
        print("=" * 60)

        if unprocessed:
            print("\n📝 Unprocessed:")
            for i, rec in enumerate(unprocessed, 1):
                print(f"  {i}. [{rec['campaign']}] {rec['filename']} ({rec['size_mb']:.1f} MB)")

        if processed:
            print("\n✅ Already Processed:")
            for i, rec in enumerate(processed, len(unprocessed) + 1):
                print(f"  {i}. [{rec['campaign']}] {rec['filename']}")

        print()
        choice = input("Select recording number (or 'q' to quit): ").strip()

        if choice.lower() == 'q':
            return None

        try:
            idx = int(choice) - 1
            if 0 <= idx < len(recordings):
                selected = recordings[idx]

                # Warn if already processed
                if selected["processed"]:
                    confirm = input("⚠️  This recording was already processed. Process again? (y/n): ").strip().lower()
                    if confirm != 'y':
                        return None

                return selected
            else:
                print("Invalid selection")
                return None
        except ValueError:
            print("Invalid input")
            return None

    def map_speakers(self, transcript_result: Dict, campaign: str) -> Dict[str, str]:
        """
        Interactive speaker mapping

        Returns: {"SPEAKER_00": "Manny (Player)", "SPEAKER_01": "DM", ...}
        """
        # Extract unique speakers from transcript
        speakers = set()
        for segment in transcript_result.get("segments", []):
            speaker = segment.get("speaker")
            if speaker:
                speakers.add(speaker)

        if not speakers:
            print("\n⚠️  No speakers identified in transcript")
            return {}

        speakers = sorted(speakers)

        print("\n" + "=" * 60)
        print("Speaker Identification")
        print("=" * 60)
        print(f"\nIdentified {len(speakers)} speaker(s) in the recording.")
        print("\nPlease identify each speaker:")
        print("  - Enter player/PC name (e.g., 'Manny', 'DM', 'Josh (Sorcerer)')")
        print("  - Or press Enter to keep auto-generated label")
        print()

        speaker_map = {}

        for speaker in speakers:
            # Show a sample of what this speaker said
            sample_segments = [
                seg for seg in transcript_result.get("segments", [])
                if seg.get("speaker") == speaker
            ][:2]  # Show first 2 segments

            print(f"\n{speaker}:")
            for seg in sample_segments:
                text = seg.get("text", "").strip()[:80]
                print(f"  \"{text}...\"")

            name = input(f"  Identify as (or Enter to keep '{speaker}'): ").strip()

            if name:
                speaker_map[speaker] = name
            else:
                speaker_map[speaker] = speaker

        return speaker_map

    def create_transcript_document(
        self,
        transcript_result: Dict,
        speaker_map: Dict[str, str],
        campaign: str,
        audio_filename: str,
        session_link: Optional[str] = None
    ) -> str:
        """
        Create formatted transcript markdown document

        Returns: markdown content
        """
        date_str = datetime.now().strftime("%Y-%m-%d")

        # Build frontmatter
        frontmatter = {
            "name": f"Session Transcript - {date_str}",
            "type": "Transcript",
            "campaign": campaign.capitalize(),
            "audio_file": audio_filename,
            "transcription_date": datetime.now().isoformat(),
            "speakers": list(speaker_map.values()),
            "language": transcript_result.get("language", "unknown")
        }

        if session_link:
            frontmatter["related_session"] = session_link

        # Build markdown
        lines = [
            "---",
            "# Frontmatter",
        ]

        for key, value in frontmatter.items():
            if isinstance(value, list):
                lines.append(f"{key}:")
                for item in value:
                    lines.append(f"  - {item}")
            else:
                lines.append(f"{key}: {value}")

        lines.extend([
            "---",
            "",
            f"# {frontmatter['name']}",
            "",
            f"**Campaign:** {frontmatter['campaign']}",
            f"**Date:** {date_str}",
            f"**Language:** {frontmatter['language']}",
            "",
            "## Speaker Map",
            ""
        ])

        # Add speaker mapping table
        for auto_label, real_name in speaker_map.items():
            lines.append(f"- **{real_name}** (identified as {auto_label})")

        lines.extend(["", "---", "", "## Transcript", ""])

        # Add transcript with real names
        current_speaker = None
        for segment in transcript_result.get("segments", []):
            speaker_id = segment.get("speaker", "Unknown")
            speaker_name = speaker_map.get(speaker_id, speaker_id)
            start_time = segment.get("start", 0)
            end_time = segment.get("end", 0)
            text = segment.get("text", "").strip()

            # Add speaker header if changed
            if speaker_name != current_speaker:
                current_speaker = speaker_name
                lines.append(f"\n### {speaker_name}")
                lines.append("")

            # Add timestamped text
            timestamp = f"[{self._format_timestamp(start_time)} - {self._format_timestamp(end_time)}]"
            lines.append(f"**{timestamp}** {text}")

        return "\n".join(lines)

    def _format_timestamp(self, seconds: float) -> str:
        """Format seconds as MM:SS"""
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes:02d}:{secs:02d}"

    def save_transcript(
        self,
        content: str,
        campaign: str,
        audio_filename: str
    ) -> Path:
        """Save transcript to campaign-content/Transcripts/"""
        date_str = datetime.now().strftime("%Y%m%d")
        base_name = Path(audio_filename).stem
        filename = f"Transcript_{campaign}_{base_name}_{date_str}.md"

        transcript_path = self.transcripts_dir / filename
        transcript_path.write_text(content, encoding="utf-8")

        return transcript_path

    def update_state(
        self,
        recording: Dict,
        transcript_path: Path,
        speaker_map: Dict[str, str],
        notion_url: Optional[str] = None
    ):
        """Update processed recordings state"""
        state = self.load_state()

        state["recordings"][recording["relative_path"]] = {
            "processed_date": datetime.now().isoformat(),
            "campaign": recording["campaign"],
            "transcript_file": str(transcript_path.relative_to(self.base_dir.parent.parent)),
            "speaker_map": speaker_map,
            "notion_url": notion_url,
            "status": "uploaded" if notion_url else "transcribed"
        }

        self.save_state(state)


def main():
    """Main interactive workflow"""
    parser = argparse.ArgumentParser(
        description="Process session recording into transcript and upload to Notion"
    )
    parser.add_argument(
        "--campaign",
        choices=["agastia", "ravnica"],
        help="Campaign to process (will auto-detect from folder if not specified)"
    )
    parser.add_argument(
        "--recording",
        help="Specific recording file path"
    )
    parser.add_argument(
        "--session-link",
        help="Wikilink to related session (e.g., '[[Session_4_Journey_to_Garreks_Falls]]')"
    )
    parser.add_argument(
        "--skip-notion",
        action="store_true",
        help="Skip Notion upload (just create transcript file)"
    )

    args = parser.parse_args()

    # Setup
    base_dir = Path(__file__).parent.parent
    processor = SessionTranscriptProcessor(base_dir)

    print("=" * 60)
    print("Session Transcript Processor")
    print("=" * 60)

    # Step 1: Select recording
    if args.recording:
        recording = {
            "path": args.recording,
            "relative_path": str(Path(args.recording).relative_to(processor.recordings_dir)),
            "campaign": args.campaign or Path(args.recording).parent.name,
            "filename": Path(args.recording).name,
            "processed": False
        }
    else:
        recording = processor.select_recording(args.campaign)

    if not recording:
        print("\nNo recording selected. Exiting.")
        return 1

    print(f"\n✓ Selected: {recording['filename']}")
    print(f"  Campaign: {recording['campaign']}")

    # Step 2: Transcribe
    print("\n" + "=" * 60)
    print("Transcribing Audio")
    print("=" * 60)

    hf_token_file = base_dir / "config" / "hf_token.txt"
    hf_token = None
    if hf_token_file.exists():
        hf_token = hf_token_file.read_text().strip()

    service = TranscriptionService(hf_token=hf_token, device="cpu", compute_type="int8")

    try:
        result = service.transcribe_audio(recording["path"])
    except Exception as e:
        print(f"\n❌ Transcription failed: {e}")
        return 1

    print("\n✓ Transcription complete")

    # Step 3: Map speakers
    speaker_map = processor.map_speakers(result, recording["campaign"])

    print(f"\n✓ Mapped {len(speaker_map)} speakers")

    # Step 4: Create transcript document
    print("\n" + "=" * 60)
    print("Creating Transcript Document")
    print("=" * 60)

    transcript_content = processor.create_transcript_document(
        result,
        speaker_map,
        recording["campaign"],
        recording["filename"],
        args.session_link
    )

    # Step 5: Save transcript
    transcript_path = processor.save_transcript(
        transcript_content,
        recording["campaign"],
        recording["filename"]
    )

    print(f"\n✓ Saved transcript: {transcript_path}")

    # Step 6: Upload to Notion (if not skipped)
    notion_url = None
    if not args.skip_notion:
        print("\n" + "=" * 60)
        print("Uploading to Notion")
        print("=" * 60)
        print("\nℹ️  Notion upload requires manual step:")
        print(f"   Run: python3 sync_notion.py {transcript_path} transcript")
        print("\n   (Automated upload will be added in future update)")

    # Step 7: Update state
    processor.update_state(recording, transcript_path, speaker_map, notion_url)

    print("\n" + "=" * 60)
    print("✅ Processing Complete!")
    print("=" * 60)
    print(f"\nTranscript file: {transcript_path}")
    print(f"State updated: {processor.state_file}")
    print("\nNext steps:")
    print("  1. Review transcript file")
    print("  2. Upload to Notion (see command above)")
    print("  3. Link to session document if needed")
    print("  4. Commit transcript to git:")
    print(f"     git add {transcript_path}")
    print(f"     git add {processor.state_file}")
    print(f"     git commit -m 'Add session transcript for {recording['campaign']}'")

    return 0


if __name__ == "__main__":
    sys.exit(main())
