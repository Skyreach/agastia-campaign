# Session Transcript Workflow

Complete end-to-end workflow for processing D&D session audio recordings into Notion transcripts.

## Overview

```
Audio Recording → Transcription → Speaker Mapping → Notion Upload → Git Commit
```

## Prerequisites

- ✅ WhisperX installed and configured
- ✅ HuggingFace token set up (for speaker diarization)
- ✅ Notion API key configured
- ✅ Campaign folders created (`recordings/agastia/`, `recordings/ravnica/`)

## Quick Start

### 1. Place Audio File

Save your session recording to the appropriate campaign folder:

```
tools/transcription/recordings/
├── agastia/
│   └── session_2026-01-25.mp3  ← Put your file here
└── ravnica/
    └── session_2026-01-26.mp3
```

**Supported formats:** MP3, WAV, M4A, OGG, FLAC

---

### 2. Process the Recording

Run the interactive processor:

```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 process_session_transcript.py
```

**Or via Claude Code command:**
```
/transcribe-session
```

---

### 3. Interactive Workflow

The script will guide you through:

#### A. Select Recording
```
Available Recordings
============================================================

📝 Unprocessed:
  1. [agastia] session_2026-01-25.mp3 (45.2 MB)

Select recording number (or 'q' to quit): 1
```

#### B. Transcription
```
✓ Selected: session_2026-01-25.mp3
  Campaign: agastia

Step 1/4: Running Whisper transcription...
Step 2/4: Aligning timestamps...
Step 3/4: Identifying speakers...
Identified 3 speakers
Step 4/4: Finalizing results...

✓ Transcription complete
```

#### C. Speaker Mapping
```
Speaker Identification
============================================================

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
```

#### D. Transcript Generation
```
✓ Saved transcript: campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_20260125.md
```

---

### 4. Review Transcript

Check the generated file:

```bash
cat campaign-content/Transcripts/Transcript_agastia_*.md
```

**Transcript includes:**
- Frontmatter with metadata (campaign, date, speakers)
- Speaker map (who each SPEAKER_XX represents)
- Full transcript with real names and timestamps

---

### 5. Upload to Notion

Upload the transcript to your Notion database:

```bash
python3 /mnt/c/dnd/sync_notion.py \
  campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_20260125.md \
  transcript
```

**This creates a Notion page with:**
- Name: "Session Transcript - 2026-01-25"
- Tags: ["transcript"]
- Campaign: "Agastia"
- Speaker map and full transcript content

**Optional:** Link to related session by adding frontmatter to transcript:
```yaml
related_session: "[[Session_4_Journey_to_Garreks_Falls]]"
```

---

### 6. Commit to Git

Add and commit the transcript (audio files are gitignored):

```bash
# Review changes
git status

# Add transcript and state file
git add campaign-content/Transcripts/Transcript_*.md
git add tools/transcription/processed_recordings.json

# Commit
git commit -m "Add session transcript for agastia - 2026-01-25"

# Push
git push
```

---

## State Tracking

The processor automatically tracks which recordings have been processed:

**Location:** `tools/transcription/processed_recordings.json`

**Contents:**
```json
{
  "recordings": {
    "agastia/session_2026-01-25.mp3": {
      "processed_date": "2026-01-25T14:30:00",
      "campaign": "agastia",
      "transcript_file": "campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_20260125.md",
      "speaker_map": {
        "SPEAKER_00": "DM",
        "SPEAKER_01": "Manny",
        "SPEAKER_02": "Josh"
      },
      "notion_url": "https://notion.so/...",
      "status": "uploaded"
    }
  }
}
```

**Benefits:**
- Prevents accidental reprocessing
- Preserves speaker mappings for reference
- Links to Notion pages
- Tracks upload status

---

## Advanced Usage

### Specify Campaign

```bash
python3 process_session_transcript.py --campaign agastia
```

### Specify Specific Recording

```bash
python3 process_session_transcript.py \
  --recording recordings/agastia/session_2026-01-25.mp3
```

### Link to Session

```bash
python3 process_session_transcript.py \
  --session-link "[[Session_4_Journey_to_Garreks_Falls]]"
```

### Skip Notion Upload

```bash
python3 process_session_transcript.py --skip-notion
```

---

## Troubleshooting

### No speakers identified

**Problem:** Transcript shows all text without speaker labels

**Solutions:**
- Check HuggingFace token is configured: `cat config/hf_token.txt`
- Verify you accepted the model license
- Audio quality may be too poor - try enhancing audio first

### Wrong speaker mapping

**Edit the transcript file manually:**
```markdown
## Speaker Map
- **DM** (identified as SPEAKER_00)
- **Manny** (identified as SPEAKER_01)  ← Change this
```

Then update speaker names in transcript content accordingly.

### Transcription quality issues

**Try larger model:**
Edit `process_session_transcript.py` line 189:
```python
service = TranscriptionService(hf_token=hf_token, device="cpu", compute_type="int8")
service.load_model("small")  # Change from "base" to "small", "medium", or "large-v2"
```

**Or:** Enhance audio before transcription (noise reduction, normalization)

### Recording not found

**Check file location:**
```bash
ls -R tools/transcription/recordings/
```

Ensure file is in:
- `recordings/agastia/` or
- `recordings/ravnica/`

---

## File Organization

### Where Things Go

```
/mnt/c/dnd/
├── tools/transcription/
│   ├── recordings/                    # Audio files (gitignored)
│   │   ├── agastia/
│   │   │   └── session_2026-01-25.mp3
│   │   └── ravnica/
│   │       └── session_2026-01-26.mp3
│   ├── processed_recordings.json      # State tracking (committed)
│   └── scripts/
│       └── process_session_transcript.py
│
└── campaign-content/
    └── Transcripts/                   # Generated transcripts (committed)
        ├── Transcript_agastia_session_2026-01-25_20260125.md
        └── Transcript_ravnica_session_2026-01-26_20260126.md
```

### What Gets Committed

✅ **Committed to Git:**
- Transcript markdown files (`campaign-content/Transcripts/*.md`)
- Processing state (`processed_recordings.json`)

❌ **NOT Committed (gitignored):**
- Audio files (`recordings/**/*.mp3`, `*.wav`, etc.)
- Temporary outputs (`outputs/`)

---

## Integration with Campaign Workflow

### Linking to Sessions

Add to Session document frontmatter:
```yaml
transcript: "[[Transcript_agastia_session_2026-01-25_20260125]]"
```

### Extracting Quotes

Copy relevant quotes from transcript into:
- Session summaries
- NPC dialogue
- Important story moments

### Player Actions

Use transcript timestamps to reference specific moments:
- "At [15:30], Manny decided to investigate the ruins"
- Create action items from player commitments

---

## Best Practices

### Audio Recording Tips

1. **Use decent microphone** - Built-in laptop mics work but USB mics are better
2. **Minimize background noise** - Close windows, turn off fans
3. **Single audio source** - Record from one computer/device
4. **Test first** - Do a 2-minute test recording before session
5. **Monitor levels** - Keep audio from clipping (too loud)

### Speaker Mapping Tips

1. **Consistent names** - Use same player names across sessions
   - Good: "Manny", "DM", "Josh"
   - Bad: "Manny (player)", "The DM", "Josh (sorcerer)"

2. **First names preferred** - Easier to read than character names
   - Use player name, not PC name unless player prefers

3. **Track your map** - Reference previous session speaker maps
   - Check `processed_recordings.json` for past mappings

### Notion Organization Tips

1. **Tag sessions** - Add transcript tag to related session pages
2. **Create transcript database view** - Filter by Type="Transcript"
3. **Link bidirectionally** - Link transcript to session, session to transcript

---

## Performance Expectations

### Processing Times (CPU)

| Audio Length | Base Model | Small Model | Medium Model |
|--------------|------------|-------------|--------------|
| 30 minutes   | 15-25 min  | 30-60 min   | 60-120 min   |
| 1 hour       | 30-60 min  | 60-120 min  | 120-240 min  |
| 2 hours      | 60-120 min | 120-240 min | 240-480 min  |

**With GPU:** 5-10x faster

**Factors affecting speed:**
- CPU power
- Audio quality/complexity
- Number of speakers
- Background noise

---

## Next Steps

After your first successful transcript:

1. **Test Notion upload** - Verify transcript appears correctly
2. **Link to session** - Connect transcript to session document
3. **Review accuracy** - Check for common transcription errors
4. **Adjust model size** if needed - Balance speed vs quality
5. **Document speaker voices** - Note which player has which voice characteristics for future reference

---

## Future Enhancements

Planned improvements:

- [ ] Automatic Notion upload (currently manual step)
- [ ] Persistent speaker mappings (remember across sessions)
- [ ] Batch processing (process multiple recordings at once)
- [ ] Voice fingerprinting (auto-identify speakers by voice)
- [ ] Auto-link to sessions by date matching
- [ ] Export to other formats (PDF, DOCX)
- [ ] Search transcripts by speaker or keyword

---

## Support

- **Workflow issues:** See this document
- **Transcription quality:** Adjust model size or audio quality
- **Notion sync:** Check Notion API key configuration
- **Speaker diarization:** Verify HuggingFace token setup
