# Installation Guide

Complete installation instructions for setting up the audio transcription tool on a new machine.

## System Requirements

- **OS:** WSL2 Ubuntu, Linux, or macOS
- **Python:** 3.8 or higher (tested on 3.10.12)
- **Disk Space:** ~4 GB for dependencies
- **RAM:** 4 GB minimum, 8 GB recommended
- **CPU:** Any modern CPU (GPU optional for faster processing)
- **Network:** Internet connection for initial setup

## Pre-Installation Checklist

- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] pip installed (`pip3 --version`)
- [ ] Git repository cloned
- [ ] Working directory: `/mnt/c/dnd/` (WSL) or equivalent

## Installation Methods

### Method 1: Quick Install (Recommended)

**Time: ~15 minutes**

```bash
# 1. Navigate to transcription directory
cd /mnt/c/dnd/tools/transcription

# 2. Install dependencies from requirements.txt
pip3 install -r requirements.txt --user

# 3. Verify installation
python3 scripts/verify_setup.py
```

Expected output:
```
✓ Python 3.10.12
✓ whisperx installed
✓ PyTorch
✓ TorchAudio
✓ Transformers
✓ PyAnnote
✓ Directory structure
✓ Scripts
✗ HuggingFace token (Not configured - this is OK for now)
```

---

### Method 2: Manual Install (If requirements.txt fails)

**Time: ~20 minutes**

```bash
# Install core dependencies first
pip3 install torch torchaudio --user
# Wait: This is large (~2 GB)

# Install ML libraries
pip3 install transformers --user

# Install audio processing
pip3 install pyannote.audio --user

# Install WhisperX (includes faster-whisper, ctranslate2)
pip3 install whisperx --user

# Verify
python3 scripts/verify_setup.py
```

---

### Method 3: Virtual Environment (Isolated Install)

**Time: ~15 minutes**

```bash
# Create virtual environment
python3 -m venv ~/transcription_env

# Activate environment
source ~/transcription_env/bin/activate

# Install dependencies
pip3 install -r requirements.txt

# Verify
python3 scripts/verify_setup.py

# Deactivate when done
deactivate
```

**Note:** If using venv, update batch scripts to activate environment first.

---

## Post-Installation Configuration

### 1. HuggingFace Token Setup

**Required for speaker diarization (identifying who is speaking)**

See detailed guide: [HUGGINGFACE_SETUP.md](./HUGGINGFACE_SETUP.md)

**Quick steps:**
1. Create account: https://huggingface.co/join
2. Generate token: https://huggingface.co/settings/tokens
3. Accept model licenses (required):
   - https://huggingface.co/pyannote/speaker-diarization
   - https://huggingface.co/pyannote/segmentation
4. Save token:
   ```bash
   cd /mnt/c/dnd/tools/transcription/config
   cp hf_token.txt.template hf_token.txt
   nano hf_token.txt  # Paste your token, save
   ```

**Can skip if:** You only need transcription without speaker identification

---

### 2. Windows Hotkey Setup (Optional)

**Required for Win+Alt+R hotkey**

See detailed guide: [WINDOWS_HOTKEY_SETUP.md](./WINDOWS_HOTKEY_SETUP.md)

**Quick steps:**
1. Create shortcut to `transcribe_windows.bat`
2. Move to Start Menu folder
3. Assign hotkey in shortcut properties

---

## Platform-Specific Instructions

### WSL2 Ubuntu (Primary Platform)

**Prerequisites:**
```bash
# Update package lists
sudo apt-get update

# Install ffmpeg (for audio format conversion)
sudo apt-get install ffmpeg

# Verify Python
python3 --version
# Should be 3.8+
```

**Install:**
```bash
cd /mnt/c/dnd/tools/transcription
pip3 install -r requirements.txt --user
```

**Test:**
```bash
python3 scripts/verify_setup.py
```

---

### Native Linux (Ubuntu/Debian)

**Prerequisites:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-pip ffmpeg
```

**Path adjustments:**
- Change `/mnt/c/dnd` to your actual repository path
- Example: `/home/username/projects/dnd`

**Install:**
```bash
cd ~/projects/dnd/tools/transcription
pip3 install -r requirements.txt --user
```

---

### macOS

**Prerequisites:**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python and ffmpeg
brew install python@3.10 ffmpeg
```

**Path adjustments:**
- Change `/mnt/c/dnd` to your repository path
- Example: `/Users/username/projects/dnd`

**Install:**
```bash
cd ~/projects/dnd/tools/transcription
pip3 install -r requirements.txt --user
```

**macOS-specific notes:**
- M1/M2 Macs: Can use `--device mps` for faster processing
- May need to install Xcode command line tools
- Batch scripts won't work - use Python directly

---

### Windows Native (Not Recommended)

**Use WSL2 instead for better compatibility**

If you must use native Windows:

**Prerequisites:**
1. Install Python from python.org
2. Check "Add Python to PATH" during install
3. Install ffmpeg: Download from https://ffmpeg.org/download.html

**Path adjustments:**
- Change all `/mnt/c/dnd` to `C:\dnd`
- Use backslashes: `C:\dnd\tools\transcription\`

**Install:**
```cmd
cd C:\dnd\tools\transcription
pip install -r requirements.txt --user
```

---

## Verification Tests

### 1. Basic Import Test

```python
python3 -c "import whisperx; import torch; print('✓ Imports successful')"
```

### 2. Model Download Test

```python
python3 -c "import whisperx; whisperx.load_model('tiny', 'cpu'); print('✓ Model loaded')"
```
**Note:** First run downloads ~40 MB model

### 3. Full Verification

```bash
python3 scripts/verify_setup.py
```

### 4. Test Transcription

```bash
# Generate 5-second test audio (requires ffmpeg)
ffmpeg -f lavfi -i "sine=frequency=1000:duration=5" test.wav

# Transcribe (should complete in <30 seconds)
python3 scripts/transcribe.py test.wav --no-diarization

# Check outputs
ls outputs/
# Should see: test_TIMESTAMP.json, test_TIMESTAMP.md, test_TIMESTAMP.txt
```

---

## Troubleshooting Installation

### "No module named 'whisperx'"

**Problem:** WhisperX not installed

**Fix:**
```bash
pip3 install whisperx --user
```

### "ERROR: Could not find a version that satisfies the requirement torch"

**Problem:** Python version too old or pip outdated

**Fix:**
```bash
# Upgrade pip
pip3 install --upgrade pip

# Check Python version
python3 --version
# Need 3.8+
```

### "Permission denied" errors

**Problem:** Installing to system directories without sudo

**Fix:**
```bash
# Always use --user flag
pip3 install -r requirements.txt --user
```

### "CUDA not available" warnings

**This is OK** - Tool works fine on CPU

To use GPU (optional):
```bash
# Verify NVIDIA GPU
nvidia-smi

# Install CUDA-enabled PyTorch
pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cu118 --user
```

### Downloads are very slow

**Problem:** PyPI servers or large dependencies

**Solutions:**
- Use faster mirror: `pip3 install --index-url https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt --user`
- Download during off-peak hours
- Split installation into smaller chunks (see Method 2)

### "Illegal instruction" on old CPUs

**Problem:** PyTorch compiled for newer CPU instructions

**Fix:**
```bash
# Use older PyTorch version
pip3 install torch==2.0.0 torchaudio==2.0.0 --user
pip3 install whisperx --user
```

---

## Multi-Machine Setup

### Scenario: Install on 3 different machines

**Machine 1 (Development):**
- Full install with all dependencies
- Keep requirements.txt updated
- Test new versions here first

**Machine 2 (Production):**
- Install from frozen requirements.txt
- Only update when dev machine tested OK
- Pin versions for stability

**Machine 3 (Backup):**
- Keep same versions as production
- Update only when production updated
- Test disaster recovery scenarios

### Keeping Machines in Sync

**After successful update on dev machine:**

1. **Export working versions:**
   ```bash
   pip3 freeze > requirements_YYYYMMDD.txt
   ```

2. **Commit to git:**
   ```bash
   git add requirements.txt requirements_YYYYMMDD.txt
   git commit -m "Update transcription deps to whisperx 3.7.4"
   git push
   ```

3. **Pull on other machines:**
   ```bash
   git pull
   pip3 install -r requirements.txt --user --upgrade
   python3 scripts/verify_setup.py
   ```

---

## Uninstall

### Remove WhisperX and Dependencies

```bash
pip3 uninstall whisperx pyannote.audio torch torchaudio transformers -y
```

### Remove Virtual Environment

```bash
rm -rf ~/transcription_env
```

### Remove Downloaded Models

```bash
# Whisper models
rm -rf ~/.cache/whisper

# HuggingFace models
rm -rf ~/.cache/huggingface
```

**Disk space recovered:** ~4-6 GB

---

## Next Steps

After successful installation:

- [ ] Read [README.md](./README.md) for usage guide
- [ ] Complete [HUGGINGFACE_SETUP.md](./HUGGINGFACE_SETUP.md) for speaker diarization
- [ ] (Optional) Setup Windows hotkey: [WINDOWS_HOTKEY_SETUP.md](./WINDOWS_HOTKEY_SETUP.md)
- [ ] Test with sample audio file
- [ ] Bookmark [MAINTENANCE.md](./MAINTENANCE.md) for future updates

---

## Installation Summary

**Minimal Install (No speaker diarization):**
```bash
pip3 install whisperx --user
```

**Full Install (With speaker diarization):**
```bash
pip3 install -r requirements.txt --user
# + HuggingFace token setup
```

**Verification:**
```bash
python3 scripts/verify_setup.py
```

**Test Run:**
```bash
python3 scripts/transcribe.py your_audio.mp3
```

---

## Support

- Installation issues: Check [MAINTENANCE.md](./MAINTENANCE.md)
- Usage questions: See [README.md](./README.md)
- Dependency conflicts: Try virtual environment (Method 3)
