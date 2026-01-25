# HuggingFace Setup Guide

Step-by-step instructions to set up HuggingFace for speaker diarization.

## Why Do I Need This?

Speaker diarization (identifying "who said what") requires machine learning models from HuggingFace. These models are free but require authentication to download.

## Step-by-Step Setup

### Step 1: Create HuggingFace Account

1. **Go to HuggingFace**
   - Visit: https://huggingface.co/join

2. **Sign Up**
   - Option A: Sign up with email
   - Option B: Sign up with GitHub (faster)

3. **Verify Email** (if using email signup)
   - Check your inbox
   - Click verification link

**Time: 2 minutes**

---

### Step 2: Generate Access Token

1. **Navigate to Token Settings**
   - Visit: https://huggingface.co/settings/tokens
   - Or: Click your profile → Settings → Access Tokens

2. **Create New Token**
   - Click "New token" button
   - **Name**: `WhisperX Diarization` (or any name you like)
   - **Role**: Select `Read` (not `Write`)
   - Click "Generate token"

3. **Copy Token**
   - **IMPORTANT**: Copy the token immediately
   - You won't be able to see it again!
   - Token looks like: `hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`

**Time: 1 minute**

---

### Step 3: Accept Model Terms

You must accept the license agreement for the speaker diarization model:

1. **Accept Community Speaker Diarization License**
   - Visit: https://huggingface.co/pyannote/speaker-diarization-community-1
   - Click "Agree and access repository"

**Why community version?** The community-maintained model is actively updated (last update: 5 months ago) while the official version hasn't been updated in 3 years. The community version is more reliable and better maintained.

**Time: 30 seconds**

---

### Step 4: Save Token Locally

#### Option A: Using Windows

1. **Navigate to config folder**
   ```
   C:\dnd\tools\transcription\config\
   ```

2. **Copy template file**
   - Right-click `hf_token.txt.template`
   - Select "Copy"
   - Paste in same folder
   - Rename copy to `hf_token.txt`

3. **Edit token file**
   - Open `hf_token.txt` in Notepad
   - Delete everything
   - Paste your token (just the token, nothing else)
   - Save and close

#### Option B: Using WSL/Linux

```bash
cd /mnt/c/dnd/tools/transcription/config
cp hf_token.txt.template hf_token.txt
nano hf_token.txt
# Paste your token, save (Ctrl+O, Enter, Ctrl+X)
```

#### Option C: Manual Creation

Create a file named `hf_token.txt` in `tools/transcription/config/` containing ONLY your token:

```
hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

**Time: 1 minute**

---

### Step 5: Verify Setup

Test that everything works:

```bash
# In WSL/Linux
cd /mnt/c/dnd/tools/transcription/scripts
python3 transcribe.py /path/to/test/audio.mp3
```

You should see:
```
Step 1/4: Running Whisper transcription...
Step 2/4: Aligning timestamps...
Step 3/4: Identifying speakers...
Identified 2 speakers
Step 4/4: Finalizing results...
```

If you see "Skipping speaker diarization", check that your token file is correct.

**Time: 2-5 minutes (depending on audio length)**

---

## Troubleshooting

### "401 Unauthorized" Error
- Your token may be invalid
- Regenerate token and save again
- Make sure you copied the entire token

### "403 Forbidden" Error
- You haven't accepted the model license
- Go back to Step 3 and accept the speaker-diarization-community-1 terms

### "File not found: hf_token.txt"
- Token file not in correct location
- Should be: `tools/transcription/config/hf_token.txt`
- NOT: `tools/transcription/config/hf_token.txt.template`

### "Speaker diarization failed"
- Check you accepted BOTH model licenses (Step 3)
- Verify token has `Read` permissions
- Try regenerating token

### Still Not Working?

Run with verbose logging:
```bash
python3 transcribe.py audio.mp3 --hf-token YOUR_TOKEN_HERE
```

If that works, your token is fine but not saved correctly.

---

## Security Notes

- **Never share your token** publicly
- Token file is automatically gitignored
- If token is compromised, revoke it at https://huggingface.co/settings/tokens
- You can regenerate tokens anytime without losing access

---

## Alternative: Skip Speaker Diarization

If you don't need speaker identification, you can skip this setup:

```bash
python3 transcribe.py audio.mp3 --no-diarization
```

Transcription will work but won't identify individual speakers.

---

## Summary Checklist

- [ ] Created HuggingFace account
- [ ] Generated Read access token
- [ ] Accepted speaker-diarization-community-1 model license
- [ ] Saved token to `config/hf_token.txt`
- [ ] Tested with sample audio
- [ ] Verified speaker identification works

**Total Time: ~5 minutes** (simplified from 10 - fewer licenses to accept!)

---

## Need Help?

- HuggingFace Documentation: https://huggingface.co/docs
- PyAnnote GitHub: https://github.com/pyannote/pyannote-audio
- WhisperX GitHub: https://github.com/m-bain/whisperX
