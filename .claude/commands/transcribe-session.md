# /transcribe-session Command

Process a D&D session audio recording into a formatted transcript and upload to Notion.

## When User Says

- "I have a new transcription to process"
- "Transcribe the latest session recording"
- "Process session audio for [campaign]"
- "/transcribe-session"

## What This Does

Full workflow from audio file to Notion:

1. **Scan** for unprocessed recordings in `tools/transcription/recordings/`
2. **Select** recording (interactive or specified)
3. **Transcribe** with speaker diarization using WhisperX
4. **Map speakers** to player/PC names (interactive)
5. **Generate** formatted transcript markdown
6. **Save** to `campaign-content/Transcripts/`
7. **Upload** to Notion as Type="Transcript"
8. **Update** processing state tracker
9. **Commit** transcript to git

## Usage

Run the interactive processor:

```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 process_session_transcript.py
```

The script will:
- Show list of available recordings
- Let user select which one to process
- Auto-detect campaign from folder structure
- Walk through speaker mapping interactively

## Arguments

```bash
# Process specific campaign
python3 process_session_transcript.py --campaign agastia

# Process specific file
python3 process_session_transcript.py --recording recordings/agastia/session_2026-01-25.mp3

# Link to session document
python3 process_session_transcript.py --session-link "[[Session_4_Journey_to_Garreks_Falls]]"

# Skip Notion upload (just create transcript)
python3 process_session_transcript.py --skip-notion
```

## File Organization

**Recordings go in:**
```
tools/transcription/recordings/
├── agastia/
│   ├── session_2026-01-25.mp3
│   └── session_2026-02-01.mp3
└── ravnica/
    └── session_2026-01-26.mp3
```

**Transcripts saved to:**
```
campaign-content/Transcripts/
├── Transcript_agastia_session_2026-01-25_20260125.md
└── Transcript_ravnica_session_2026-01-26_20260126.md
```

## State Tracking

Processing state tracked in:
```
tools/transcription/processed_recordings.json
```

Tracks:
- Which recordings have been processed
- Speaker mappings for each session
- Transcript file locations
- Notion upload status

## Speaker Mapping

When processing, you'll be asked to identify each speaker:

```
SPEAKER_00:
  "Welcome to tonight's session..."
  "Let's start with...

  Identify as (or Enter to keep 'SPEAKER_00'): DM

SPEAKER_01:
  "I want to investigate the room..."
  "Can I roll perception?..."

  Identify as (or Enter to keep 'SPEAKER_01'): Manny (Player)
```

The mapping is saved so you can reference it later.

## Transcript Format

Generated transcripts include:

```markdown
---
name: Session Transcript - 2026-01-25
type: Transcript
campaign: Agastia
speakers:
  - DM
  - Manny (Player)
  - Josh (Sorcerer)
---

# Session Transcript - 2026-01-25

## Speaker Map
- **DM** (identified as SPEAKER_00)
- **Manny (Player)** (identified as SPEAKER_01)

---

## Transcript

### DM
**[00:05 - 00:12]** Welcome to tonight's session of our Agastia campaign...

### Manny (Player)
**[00:15 - 00:18]** I want to investigate the room for traps...
```

## Notion Upload

After transcript is created, upload to Notion:

```bash
# Manual step (for now)
python3 sync_notion.py campaign-content/Transcripts/Transcript_agastia_*.md transcript
```

This creates a new page in the campaign database with:
- Type: "Transcript"
- Title: "Session Transcript - [date]"
- Campaign field set
- Speaker map included
- Full transcript content

## Git Workflow

After processing:

```bash
# Review transcript
cat campaign-content/Transcripts/Transcript_agastia_*.md

# Add to git
git add campaign-content/Transcripts/Transcript_*.md
git add tools/transcription/processed_recordings.json

# Commit
git commit -m "Add session transcript for agastia - 2026-01-25"

# Push
git push
```

**Note:** Audio files are gitignored (too large), only transcripts are committed.

## Troubleshooting

### No recordings found
- Ensure audio files are in `recordings/agastia/` or `recordings/ravnica/`
- Supported formats: MP3, WAV, M4A, OGG, FLAC

### Speaker diarization not working
- Check HuggingFace token is configured
- Run: `python3 verify_setup.py`

### Transcript quality issues
- Try larger Whisper model: edit `process_session_transcript.py` line with `load_model("base")` → `load_model("small")`
- Check audio quality - background noise affects accuracy

## Example Session

```
$ python3 process_session_transcript.py --campaign agastia

============================================================
Session Transcript Processor
============================================================

Available Recordings
============================================================

📝 Unprocessed:
  1. [agastia] session_2026-01-25.mp3 (45.2 MB)
  2. [agastia] session_2026-02-01.mp3 (52.8 MB)

Select recording number (or 'q' to quit): 1

✓ Selected: session_2026-01-25.mp3
  Campaign: agastia

============================================================
Transcribing Audio
============================================================

Step 1/4: Running Whisper transcription...
Step 2/4: Aligning timestamps...
Step 3/4: Identifying speakers...
Identified 3 speakers
Step 4/4: Finalizing results...

✓ Transcription complete

============================================================
Speaker Identification
============================================================

Identified 3 speaker(s) in the recording.

SPEAKER_00:
  "Welcome everyone to session four..."
  Identify as (or Enter to keep 'SPEAKER_00'): DM

SPEAKER_01:
  "I want to check for traps..."
  Identify as (or Enter to keep 'SPEAKER_01'): Manny

SPEAKER_02:
  "Can I cast detect magic?..."
  Identify as (or Enter to keep 'SPEAKER_02'): Josh

✓ Mapped 3 speakers

============================================================
Creating Transcript Document
============================================================

✓ Saved transcript: campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_20260125.md

============================================================
✅ Processing Complete!
============================================================

Transcript file: campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_20260125.md
State updated: tools/transcription/processed_recordings.json
```

## Future Enhancements

- [ ] Automatic Notion upload (currently manual)
- [ ] Auto-link to Session pages by date
- [ ] Persist speaker mappings across sessions
- [ ] Batch processing multiple recordings
- [ ] Speaker voice fingerprinting for auto-identification
