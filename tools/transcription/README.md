# Audio Transcription Tool

Local audio transcription system with speaker diarization using WhisperX.

## Features

- **Automatic Speech Recognition** using OpenAI Whisper
- **Speaker Diarization** (identifies who is speaking when)
- **Multiple Output Formats**: JSON, Markdown, and Plain Text
- **Progress Tracking** during transcription
- **Windows Hotkey Integration** (Win+Alt+R)
- **Microphone Support** (coming soon)
- **Notion Integration** for campaign session transcripts

## Quick Start

### 1. Get a HuggingFace Token (Required for Speaker Diarization)

Speaker diarization requires a free HuggingFace account:

1. **Create Account**
   - Go to https://huggingface.co/join
   - Sign up with email or GitHub

2. **Get Access Token**
   - Visit https://huggingface.co/settings/tokens
   - Click "New token"
   - Name it "WhisperX Diarization"
   - Role: "Read"
   - Click "Generate"
   - **Copy the token** (you won't see it again!)

3. **Accept Model Terms**
   - Visit https://huggingface.co/pyannote/speaker-diarization
   - Click "Agree and access repository"
   - Visit https://huggingface.co/pyannote/segmentation
   - Click "Agree and access repository"

4. **Save Token**
   - Copy `config/hf_token.txt.template` to `config/hf_token.txt`
   - Paste your token into `config/hf_token.txt`
   - Save the file

   ```bash
   # In WSL/Linux
   cd /mnt/c/dnd/tools/transcription/config
   cp hf_token.txt.template hf_token.txt
   # Edit hf_token.txt and paste your token
   ```

### 2. Basic Usage

**From Command Line (WSL/Linux):**

```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 transcribe.py /path/to/your/audio.mp3
```

**From Windows (Double-click or Hotkey):**

```cmd
C:\dnd\tools\transcription\scripts\transcribe_windows.bat
```

This will open a file picker dialog to select your audio file.

### 3. Setup Windows Hotkey (Win+Alt+R)

1. **Create Shortcut**
   - Right-click `transcribe_windows.bat`
   - Select "Create shortcut"
   - Move shortcut to `C:\Users\YOUR_USERNAME\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\`

2. **Assign Hotkey**
   - Right-click the shortcut
   - Select "Properties"
   - Click in "Shortcut key" field
   - Press: `Win + Alt + R`
   - Click "OK"

3. **Test It**
   - Press `Win + Alt + R` anywhere in Windows
   - File picker should open
   - Select an audio file to transcribe

## Command-Line Options

```bash
python3 transcribe.py [OPTIONS] AUDIO_FILE

Required:
  AUDIO_FILE              Path to audio file (MP3, WAV, M4A, OGG, etc.)

Optional:
  --model MODEL           Whisper model size: tiny, base, small, medium, large-v2
                          (default: base)
                          - tiny: fastest, lowest quality
                          - base: good balance (recommended)
                          - large-v2: best quality, slowest

  --language LANG         Language code (e.g., 'en', 'es')
                          Omit for auto-detection

  --device DEVICE         cpu or cuda (default: cpu)
                          Use cuda if you have NVIDIA GPU

  --output-dir DIR        Custom output directory
                          (default: ../outputs/)

  --hf-token TOKEN        HuggingFace token (overrides config file)

  --no-diarization        Skip speaker identification
                          (faster, but no speaker labels)
```

### Examples

```bash
# Basic transcription (auto-detect language)
python3 transcribe.py session_recording.mp3

# Specify language and model
python3 transcribe.py session_recording.mp3 --language en --model small

# Skip speaker diarization (faster)
python3 transcribe.py session_recording.mp3 --no-diarization

# Use GPU acceleration (if available)
python3 transcribe.py session_recording.mp3 --device cuda

# Custom output location
python3 transcribe.py session_recording.mp3 --output-dir /mnt/c/transcripts/
```

## Output Files

Each transcription generates 3 files in the `outputs/` directory:

### 1. JSON Format (`*_TIMESTAMP.json`)
Complete structured data with metadata and word-level timestamps:
```json
{
  "metadata": {
    "audio_file": "session_recording.mp3",
    "timestamp": "2026-01-25T14:30:00",
    "language": "en",
    "num_segments": 42
  },
  "segments": [
    {
      "start": 0.0,
      "end": 3.5,
      "text": "Welcome to tonight's session",
      "speaker": "SPEAKER_00"
    }
  ]
}
```

### 2. Markdown Format (`*_TIMESTAMP.md`)
Readable format with speaker headers and timestamps:
```markdown
# Transcript: session_recording.mp3

**Date:** 2026-01-25 14:30:00
**Language:** en

---

## SPEAKER_00

**[0.00s - 3.50s]** Welcome to tonight's session

**[3.60s - 8.20s]** Today we're going to explore the ruins
```

### 3. Plain Text Format (`*_TIMESTAMP.txt`)
Simple speaker-labeled transcript:
```
[0.0s] SPEAKER_00: Welcome to tonight's session
[3.6s] SPEAKER_00: Today we're going to explore the ruins
[8.5s] SPEAKER_01: I'm ready to go
```

## Notion Integration

To upload transcripts to Notion (for D&D session notes):

```bash
# Use the Claude Code skill (in development)
/transcript-upload outputs/session_recording_20260125_143000.md
```

Or manually:
1. Open the `.md` file
2. Copy contents
3. Paste into your Notion session page

## Troubleshooting

### "No module named 'whisperx'"
WhisperX isn't installed. Run:
```bash
pip3 install whisperx --user
```

### "Speaker diarization failed"
- Make sure you've accepted the model terms (see step 1.3 above)
- Verify your HuggingFace token is correct
- Try with `--no-diarization` flag

### "CUDA out of memory" (GPU users)
Use a smaller model:
```bash
python3 transcribe.py audio.mp3 --model base --device cpu
```

### Slow transcription on CPU
- Use smaller model: `--model tiny` or `--model base`
- Expect ~3-5x realtime (10min audio = 30-50min processing)
- Consider upgrading to GPU for faster processing

### Windows batch file doesn't work
- Verify Python is installed: `python3 --version`
- Check paths in `transcribe_windows.bat`
- Run from command prompt to see error messages

## Model Size Guide

| Model    | Size  | Speed      | Quality | Recommended For           |
|----------|-------|------------|---------|---------------------------|
| tiny     | 39M   | Very Fast  | Fair    | Quick drafts, testing     |
| base     | 74M   | Fast       | Good    | **Most users (default)**  |
| small    | 244M  | Moderate   | Better  | Important recordings      |
| medium   | 769M  | Slow       | Great   | High-quality needs        |
| large-v2 | 1550M | Very Slow  | Best    | Professional transcription|

## Supported Audio Formats

- MP3
- WAV
- M4A
- OGG
- FLAC
- AAC
- Most common audio formats via ffmpeg

## Directory Structure

```
tools/transcription/
├── config/
│   ├── hf_token.txt          # Your HuggingFace token (gitignored)
│   └── hf_token.txt.template # Template for token file
├── outputs/                   # Transcription results (gitignored)
│   ├── recording_20260125_143000.json
│   ├── recording_20260125_143000.md
│   └── recording_20260125_143000.txt
├── scripts/
│   ├── transcribe.py         # Main Python script
│   └── transcribe_windows.bat # Windows batch wrapper
└── README.md                  # This file
```

## Privacy & Security

- **All processing is LOCAL** - audio never leaves your machine
- HuggingFace token is only used to download speaker diarization models
- Transcripts are saved locally in `outputs/` directory
- Add `tools/transcription/config/hf_token.txt` to `.gitignore` (already done)

## Performance Tips

1. **Close other applications** during transcription
2. **Use SSD storage** for audio files
3. **Batch process** multiple files overnight
4. **GPU acceleration** dramatically improves speed (4-10x faster)
5. **Smaller models** process faster but with lower quality

## Next Steps

- [ ] Test with sample audio
- [ ] Setup Windows hotkey
- [ ] Create Notion upload skill
- [ ] Configure microphone input
- [ ] Integrate with D&D session workflow

## Support

Issues or questions? Check:
- [WhisperX GitHub](https://github.com/m-bain/whisperX)
- [Pyannote Documentation](https://github.com/pyannote/pyannote-audio)
- [HuggingFace Help](https://huggingface.co/docs)
