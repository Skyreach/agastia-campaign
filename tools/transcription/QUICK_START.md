# Transcript Workflow - Quick Reference

## 🎯 You're Ready to Test!

Everything is set up. Here's how to process your first session transcript.

---

## Step 1: Place Your Audio File

Copy your session recording to the campaign folder:

```bash
# For Agastia campaign
cp /path/to/your/recording.mp3 /mnt/c/dnd/tools/transcription/recordings/agastia/

# For Ravnica campaign
cp /path/to/your/recording.mp3 /mnt/c/dnd/tools/transcription/recordings/ravnica/
```

**Or in Windows:**
- Navigate to: `C:\dnd\tools\transcription\recordings\agastia\`
- Paste your MP3/WAV file

---

## Step 2: Run the Processor

```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 process_session_transcript.py
```

**Or use Claude Code:**
```
Tell me: "I have a new transcription to process for agastia"
I'll run: /transcribe-session
```

---

## Step 3: Follow the Interactive Prompts

The script will:
1. ✅ Show you available recordings
2. ✅ Ask you to select one
3. ✅ Transcribe it (~3-5x realtime for base model)
4. ✅ Ask you to identify each speaker
5. ✅ Save transcript to `campaign-content/Transcripts/`
6. ✅ Update processing state

---

## Step 4: Upload to Notion

```bash
python3 /mnt/c/dnd/sync_notion.py \
  campaign-content/Transcripts/Transcript_agastia_*.md \
  transcript
```

---

## Step 5: Commit

```bash
git add campaign-content/Transcripts/Transcript_*.md
git add tools/transcription/processed_recordings.json
git commit -m "Add session transcript for agastia - $(date +%Y-%m-%d)"
git push
```

---

## 📋 What You'll See

### Speaker Identification Prompt:
```
SPEAKER_00:
  "Welcome everyone to tonight's session..."
  Identify as: DM

SPEAKER_01:
  "I want to check for traps..."
  Identify as: Manny

SPEAKER_02:
  "Can I cast detect magic..."
  Identify as: Josh
```

### Generated Transcript:
```markdown
---
name: Session Transcript - 2026-01-25
type: Transcript
campaign: Agastia
speakers:
  - DM
  - Manny
  - Josh
---

# Session Transcript - 2026-01-25

## Speaker Map
- **DM** (identified as SPEAKER_00)
- **Manny** (identified as SPEAKER_01)
- **Josh** (identified as SPEAKER_02)

---

## Transcript

### DM
**[00:05 - 00:12]** Welcome to tonight's session...

### Manny
**[00:15 - 00:22]** I want to investigate the ruins...
```

---

## ⚡ Commands Quick Reference

| Task | Command |
|------|---------|
| Process recording | `python3 process_session_transcript.py` |
| Process specific campaign | `python3 process_session_transcript.py --campaign agastia` |
| Process specific file | `python3 process_session_transcript.py --recording path/to/file.mp3` |
| Skip Notion upload | `python3 process_session_transcript.py --skip-notion` |
| Upload to Notion | `python3 sync_notion.py transcript_file.md transcript` |
| Check what's processed | `cat processed_recordings.json` |
| Verify setup | `python3 verify_setup.py` |

---

## 🚨 Common Issues

### "No recordings found"
- Check files are in `recordings/agastia/` or `recordings/ravnica/`
- Supported: MP3, WAV, M4A, OGG, FLAC

### "Speaker diarization failed"
- Verify HF token: `cat config/hf_token.txt`
- Should start with `hf_`

### "Transcription too slow"
- Use smaller model (edit script, change "base" to "tiny")
- Or run overnight for long sessions

---

## 📁 File Locations

```
tools/transcription/
├── recordings/              # Put audio files here
│   ├── agastia/
│   └── ravnica/
├── scripts/
│   └── process_session_transcript.py  # Main script
└── processed_recordings.json          # State tracker

campaign-content/
└── Transcripts/            # Generated transcripts
    └── Transcript_*.md
```

---

## ✅ Ready to Test!

When you're ready:
1. Place an audio file in `recordings/agastia/` or `recordings/ravnica/`
2. Run `python3 process_session_transcript.py`
3. Follow the prompts
4. Upload to Notion
5. Commit to git

**Full documentation:** See `WORKFLOW.md`

---

## 🎙️ Test Audio

Don't have a session recording yet? Create a test file:

```bash
# Generate 30-second test audio (requires ffmpeg)
ffmpeg -f lavfi -i "sine=frequency=1000:duration=30" \
  -af "volume=0.5" \
  recordings/agastia/test_audio.wav
```

Then process it to test the workflow!
