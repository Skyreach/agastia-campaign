# 🎉 Session Transcript Workflow - Ready to Test!

Your complete audio transcription workflow is set up and ready to use.

## ✅ What's Built

### Core Components
- ✅ **Recording folders** - `recordings/agastia/` and `recordings/ravnica/`
- ✅ **Interactive processor** - `scripts/process_session_transcript.py`
- ✅ **Speaker mapping** - Identify SPEAKER_XX → Real player names
- ✅ **State tracking** - `processed_recordings.json` tracks what's processed
- ✅ **Transcript storage** - `campaign-content/Transcripts/`
- ✅ **Claude command** - `/transcribe-session` wraps the workflow
- ✅ **Git integration** - Audio files gitignored, transcripts committed

### Documentation
- ✅ **Quick Start** - `QUICK_START.md` - Fast reference card
- ✅ **Full Workflow** - `WORKFLOW.md` - Complete guide
- ✅ **HF Setup** - `HUGGINGFACE_SETUP.md` - Token configuration ✅ DONE
- ✅ **Maintenance** - `MAINTENANCE.md` - Long-term tracking
- ✅ **Installation** - `INSTALL.md` - New machine setup

---

## 🚀 Test It Now

Here's what to do with your audio file:

### Step 1: Place Your Recording

**In Windows:**
1. Open: `C:\dnd\tools\transcription\recordings\agastia\`
2. Paste your session recording (MP3/WAV)

**In WSL:**
```bash
cp /path/to/recording.mp3 /mnt/c/dnd/tools/transcription/recordings/agastia/
```

---

### Step 2: Run the Processor

**Via Claude Code (Recommended):**
```
Tell me: "I have a new transcription to process for agastia"
```

**Or directly:**
```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 process_session_transcript.py
```

---

### Step 3: Interactive Workflow

You'll be prompted to:

1. **Select recording** from list
2. **Wait for transcription** (~3-5x realtime)
3. **Identify speakers** one by one:
   ```
   SPEAKER_00: "Welcome to session four..."
   Identify as: DM

   SPEAKER_01: "I investigate the room..."
   Identify as: Manny
   ```

4. **Transcript saved** to `campaign-content/Transcripts/`

---

### Step 4: Upload to Notion

```bash
# Find your transcript file
ls campaign-content/Transcripts/

# Upload to Notion
python3 /mnt/c/dnd/sync_notion.py \
  campaign-content/Transcripts/Transcript_agastia_session_YYYYMMDD_HHMMSS.md \
  transcript
```

**In Notion, you'll see:**
- Name: "Session Transcript - [date]"
- Type: transcript (in Tags)
- Campaign: Agastia
- Speaker map
- Full formatted transcript with timestamps

---

### Step 5: Commit to Git

```bash
git add campaign-content/Transcripts/Transcript_*.md
git add tools/transcription/processed_recordings.json
git commit -m "Add session transcript for agastia"
git push
```

---

## 📊 Expected Output

### Processing Time
- **30-minute recording** → 15-25 minutes (base model, CPU)
- **1-hour recording** → 30-60 minutes
- **2-hour recording** → 60-120 minutes

### Generated Files

**Transcript file:**
```
campaign-content/Transcripts/
└── Transcript_agastia_session_2026-01-25_143052.md
```

**State file updated:**
```json
{
  "recordings": {
    "agastia/session_2026-01-25.mp3": {
      "processed_date": "2026-01-25T14:30:52",
      "campaign": "agastia",
      "transcript_file": "campaign-content/Transcripts/Transcript_agastia_session_2026-01-25_143052.md",
      "speaker_map": {
        "SPEAKER_00": "DM",
        "SPEAKER_01": "Manny",
        "SPEAKER_02": "Josh"
      },
      "status": "transcribed"
    }
  }
}
```

---

## 🎯 What You Get

### Transcript Structure

```markdown
---
name: Session Transcript - 2026-01-25
type: Transcript
campaign: Agastia
speakers:
  - DM
  - Manny
  - Josh
language: en
---

# Session Transcript - 2026-01-25

**Campaign:** Agastia
**Date:** 2026-01-25
**Language:** en

## Speaker Map
- **DM** (identified as SPEAKER_00)
- **Manny** (identified as SPEAKER_01)
- **Josh** (identified as SPEAKER_02)

---

## Transcript

### DM
**[00:05 - 00:12]** Welcome to tonight's session of our Agastia campaign...

**[00:15 - 00:25]** You're standing at the entrance to the ruins...

### Manny
**[00:30 - 00:35]** I want to check for traps before we enter.

**[00:38 - 00:42]** Can I roll perception?

### DM
**[00:45 - 00:55]** Go ahead and roll perception. DC is 15 to spot anything unusual.
```

---

## 📁 File Organization

### What Gets Created

```
/mnt/c/dnd/
├── tools/transcription/
│   ├── recordings/
│   │   ├── agastia/
│   │   │   └── session_2026-01-25.mp3    ← Your audio (NOT committed)
│   │   └── ravnica/
│   ├── processed_recordings.json         ← State tracker (committed)
│   └── scripts/
│       └── process_session_transcript.py
│
└── campaign-content/
    └── Transcripts/
        └── Transcript_agastia_session_2026-01-25_143052.md  ← Transcript (committed)
```

### What's Gitignored

- ❌ Audio files (`recordings/**/*.mp3`, `*.wav`, etc.)
- ❌ Temporary outputs (`outputs/`)

### What's Committed

- ✅ Transcript markdown files
- ✅ Processing state file

---

## 🔍 Verify Before Testing

Run the setup verification:

```bash
cd /mnt/c/dnd/tools/transcription/scripts
python3 verify_setup.py
```

**Should show:**
```
✓ Python 3.10.12
✓ whisperx installed
✓ PyTorch
✓ TorchAudio
✓ Transformers
✓ PyAnnote
✓ Directory structure
✓ Scripts
✓ HuggingFace token
```

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | Fast reference - use this after first read |
| **WORKFLOW.md** | Complete workflow guide |
| **README.md** | Feature overview and basic usage |
| **HUGGINGFACE_SETUP.md** | HF token setup (DONE ✅) |
| **MAINTENANCE.md** | Long-term sustainability tracking |
| **INSTALL.md** | New machine installation guide |

---

## 🎮 Commands Reference

```bash
# Process recording (interactive)
python3 process_session_transcript.py

# Process specific campaign
python3 process_session_transcript.py --campaign agastia

# Process specific file
python3 process_session_transcript.py --recording recordings/agastia/file.mp3

# Link to session
python3 process_session_transcript.py --session-link "[[Session_4_Journey_to_Garreks_Falls]]"

# Skip Notion (just create transcript)
python3 process_session_transcript.py --skip-notion

# Upload to Notion
python3 /mnt/c/dnd/sync_notion.py transcript_file.md transcript

# Check processing state
cat processed_recordings.json
```

---

## 🚦 You're Ready!

Everything is set up. When you're ready to test:

1. **Place audio file** in `recordings/agastia/` or `recordings/ravnica/`
2. **Run processor**: `python3 process_session_transcript.py`
3. **Follow prompts** for speaker mapping
4. **Upload to Notion**
5. **Commit to git**

**Full details:** See [QUICK_START.md](./QUICK_START.md)

---

## 💬 Tell Me When You're Ready

Just say:
- "I have a new transcription to process for [campaign]"
- "Let's transcribe the session recording"
- "/transcribe-session"

And I'll guide you through it!

---

## 🎉 Let's Test It!

Drop your audio file in the recordings folder and let's see it work end-to-end!
