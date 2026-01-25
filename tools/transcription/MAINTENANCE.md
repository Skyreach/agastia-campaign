# Maintenance & Long-Term Sustainability

## Design Decisions

### Using Community Diarization Model

**Model:** `pyannote/speaker-diarization-community-1`
**Why:** Active maintenance is better than official abandonment
**Decision Date:** 2026-01-25

**Comparison:**
- Official (`pyannote/speaker-diarization`): Last updated 3 years ago
- Community (`pyannote/speaker-diarization-community-1`): Last updated 5 months ago
- Community version has fewer license terms to accept
- Community version has higher usage in production

**Monitor:** https://huggingface.co/pyannote/speaker-diarization-community-1

**Fallback:** If community version breaks, can switch back to official:
```python
# In transcribe.py line 97-99, change model_name to:
model_name="pyannote/speaker-diarization"
```

---

## Known Issues & Watch List

### ⚠️ Active Deprecation Warnings

#### TorchAudio Backend Deprecation (Non-Blocking)
**Status:** Warning only - functionality intact
**Affects:** `pyannote.audio` library
**Issue:** TorchAudio is deprecating `list_audio_backends()` API
**Timeline:** Will be removed in TorchAudio 2.9
**Current Version:** TorchAudio 2.8.0

**What to watch:**
- Monitor pyannote.audio releases: https://github.com/pyannote/pyannote-audio/releases
- Expected fix: pyannote.audio 3.5.0+ (not yet released)
- GitHub issue: https://github.com/pytorch/audio/issues/3902

**Action needed:**
- No immediate action required
- When TorchAudio 2.9 is released, update pyannote.audio to compatible version
- Test after updates: `python3 verify_setup.py`

**Workaround if breaks:**
```bash
# Pin to TorchAudio 2.8.x until pyannote updates
pip3 install 'torchaudio<2.9' --user
```

---

## Dependency Update Strategy

### When to Update

**Monthly Check** (Low Priority):
```bash
pip3 list --outdated | grep -E "(whisperx|torch|pyannote)"
```

**Update Triggers** (High Priority):
- Security vulnerabilities reported
- Critical bug fixes in whisperx
- New features needed for workflow
- Compatibility issues with system updates

### How to Update Safely

1. **Check Current Versions**
   ```bash
   pip3 freeze > current_versions.txt
   ```

2. **Update in Test Environment First**
   ```bash
   # Create virtual environment for testing
   python3 -m venv ~/test_transcription
   source ~/test_transcription/bin/activate
   pip3 install -r requirements.txt
   python3 verify_setup.py
   # Test with sample audio
   deactivate
   ```

3. **If Tests Pass, Update Production**
   ```bash
   pip3 install -r requirements.txt --upgrade --user
   ```

4. **Update requirements.txt**
   ```bash
   pip3 freeze | grep -E "(whisperx|torch|pyannote|transformers)" > requirements.txt
   ```

5. **Commit Changes**
   ```bash
   git add requirements.txt MAINTENANCE.md
   git commit -m "Update transcription dependencies to [version]"
   ```

---

## Version Compatibility Matrix

| Component         | Current | Min Required | Notes                          |
|-------------------|---------|--------------|--------------------------------|
| Python            | 3.10.12 | 3.8          | Tested on 3.10, should work 3.8-3.12 |
| whisperx          | 3.7.4   | 3.1.0        | Core transcription engine      |
| torch             | 2.8.0   | 2.0.0        | Deep learning framework        |
| torchaudio        | 2.8.0   | 2.0.0        | Audio processing               |
| pyannote.audio    | 3.4.0   | 3.1.0        | Speaker diarization            |
| transformers      | 4.57.6  | 4.20.0       | HuggingFace models             |

---

## Breaking Changes to Watch

### PyTorch 2.x → 3.x (Future)
- **Impact:** Medium - may require code changes
- **Timeline:** Unknown (2026-2027?)
- **Monitor:** https://pytorch.org/blog/

### WhisperX API Changes
- **Last Breaking Change:** v3.0.0 (2023-08)
- **Stability:** Stable API since 3.1.0
- **Monitor:** https://github.com/m-bain/whisperX/releases

### HuggingFace Token Authentication
- **Current:** Read tokens via pyannote
- **Future:** May require fine-grained permissions
- **Action:** If auth fails, regenerate token with updated permissions

---

## Troubleshooting Future Issues

### If Speaker Diarization Breaks

1. **Check pyannote.audio compatibility**
   ```bash
   pip3 show pyannote.audio
   # Look for compatible torch/torchaudio versions in metadata
   ```

2. **Downgrade to last known working versions**
   ```bash
   pip3 install torch==2.8.0 torchaudio==2.8.0 pyannote.audio==3.4.0
   ```

3. **Check HuggingFace model access**
   - Visit: https://huggingface.co/pyannote/speaker-diarization
   - Ensure model hasn't been deprecated or moved

### If Transcription Quality Degrades

1. **Try different Whisper model**
   ```bash
   python3 transcribe.py audio.mp3 --model large-v2
   ```

2. **Check for newer Whisper models**
   - OpenAI may release v4, v5 in future
   - WhisperX will add support in updates

---

## Installation on New Machines

### Quick Install (Recommended)

```bash
cd /mnt/c/dnd/tools/transcription
pip3 install -r requirements.txt --user
python3 scripts/verify_setup.py
```

### Manual Install (If requirements.txt fails)

```bash
# Install in order of dependencies
pip3 install torch torchaudio --user
pip3 install transformers --user
pip3 install pyannote.audio --user
pip3 install whisperx --user
```

### Platform-Specific Notes

**WSL2 (Ubuntu):**
- ✅ Tested and working
- No special configuration needed

**Native Linux:**
- ✅ Should work identically
- May need: `sudo apt-get install ffmpeg`

**macOS:**
- ⚠️ Untested but should work
- May need Xcode command line tools
- ARM (M1/M2): Use `device=mps` instead of `cpu` for acceleration

**Windows (Native):**
- ⚠️ Not recommended - use WSL2 instead
- If necessary: Install Python from python.org
- Change paths in batch scripts from `/mnt/c/` to `C:\`

---

## Monitoring & Alerts

### Set Up Update Notifications

**GitHub Watch:**
- Watch releases: https://github.com/m-bain/whisperX
- Watch releases: https://github.com/pyannote/pyannote-audio

**Security Advisories:**
```bash
# Check for security vulnerabilities
pip3 list --outdated | grep -E "(torch|transformers|whisperx)"
```

**Quarterly Health Check:**
- [ ] Run `verify_setup.py`
- [ ] Test with sample audio
- [ ] Check deprecation warnings in output
- [ ] Review GitHub issues for known problems
- [ ] Update this document with findings

---

## Rollback Procedure

If an update breaks functionality:

1. **Uninstall current versions**
   ```bash
   pip3 uninstall whisperx pyannote.audio torch torchaudio -y
   ```

2. **Reinstall from requirements.txt**
   ```bash
   pip3 install -r requirements.txt --user
   ```

3. **If requirements.txt also broken, use git history**
   ```bash
   git log requirements.txt
   git show <commit-hash>:tools/transcription/requirements.txt > requirements_old.txt
   pip3 install -r requirements_old.txt --user
   ```

---

## Contact & Support

**Primary Maintainer:** User (via Claude Code)

**External Resources:**
- WhisperX Issues: https://github.com/m-bain/whisperX/issues
- PyAnnote Support: https://github.com/pyannote/pyannote-audio/discussions
- HuggingFace Forum: https://discuss.huggingface.co/

**Documentation Updates:**
- When updating dependencies, update this file
- Add new known issues as discovered
- Document any workarounds or fixes

---

## Next Review Date

**Last Updated:** 2026-01-25
**Next Review:** 2026-04-25 (3 months)

**Review Checklist:**
- [ ] Check for deprecated dependencies
- [ ] Test with latest Python version
- [ ] Verify HuggingFace model access
- [ ] Update requirements.txt if needed
- [ ] Test on fresh machine install
- [ ] Update compatibility matrix
