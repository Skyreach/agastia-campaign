#!/usr/bin/env python3
"""
Verify Transcription Setup
Check that all dependencies and configurations are correct
"""

import sys
from pathlib import Path


def check_python_version():
    """Verify Python version is 3.8+"""
    print("Checking Python version...", end=" ")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} (need 3.8+)")
        return False


def check_whisperx():
    """Verify WhisperX is installed"""
    print("Checking WhisperX installation...", end=" ")
    try:
        import whisperx
        print(f"✓ whisperx {whisperx.__version__ if hasattr(whisperx, '__version__') else 'installed'}")
        return True
    except ImportError:
        print("✗ Not installed")
        print("  Fix: pip3 install whisperx --user")
        return False


def check_dependencies():
    """Check required dependencies"""
    deps = [
        ("torch", "PyTorch"),
        ("torchaudio", "TorchAudio"),
        ("transformers", "Transformers"),
        ("pyannote.audio", "PyAnnote")
    ]

    all_ok = True
    for module_name, display_name in deps:
        print(f"Checking {display_name}...", end=" ")
        try:
            __import__(module_name)
            print("✓")
        except ImportError:
            print("✗ Not installed")
            all_ok = False

    return all_ok


def check_hf_token():
    """Check if HuggingFace token is configured"""
    print("Checking HuggingFace token...", end=" ")

    config_file = Path(__file__).parent.parent / "config" / "hf_token.txt"

    if not config_file.exists():
        print("✗ Not configured")
        print(f"  Location: {config_file}")
        print("  See: HUGGINGFACE_SETUP.md")
        return False

    token = config_file.read_text().strip()

    if not token or "YOUR_" in token.upper():
        print("✗ Invalid token (still template)")
        print("  Edit the file and paste your real token")
        return False

    if not token.startswith("hf_"):
        print("✗ Invalid format (should start with 'hf_')")
        return False

    # Mask token for security
    masked = f"{token[:6]}...{token[-4:]}"
    print(f"✓ {masked}")
    return True


def check_directories():
    """Verify directory structure"""
    print("Checking directory structure...", end=" ")

    base_dir = Path(__file__).parent.parent
    required_dirs = ["config", "outputs", "scripts"]

    all_exist = True
    for dir_name in required_dirs:
        dir_path = base_dir / dir_name
        if not dir_path.exists():
            print(f"✗ Missing: {dir_name}")
            all_exist = False

    if all_exist:
        print("✓")

    return all_exist


def check_scripts():
    """Verify required scripts exist"""
    print("Checking scripts...", end=" ")

    base_dir = Path(__file__).parent
    required_scripts = [
        "transcribe.py",
        "transcribe_windows.bat"
    ]

    all_exist = True
    for script_name in required_scripts:
        script_path = base_dir / script_name
        if not script_path.exists():
            print(f"✗ Missing: {script_name}")
            all_exist = False

    if all_exist:
        print("✓")

    return all_exist


def main():
    """Run all verification checks"""
    print("=" * 60)
    print("Transcription Setup Verification")
    print("=" * 60)
    print()

    checks = [
        check_python_version(),
        check_whisperx(),
        check_dependencies(),
        check_directories(),
        check_scripts(),
        check_hf_token()
    ]

    print()
    print("=" * 60)

    if all(checks):
        print("✅ All checks passed! Setup is complete.")
        print()
        print("Next steps:")
        print("1. Test with sample audio:")
        print("   python3 transcribe.py /path/to/audio.mp3")
        print()
        print("2. Setup Windows hotkey:")
        print("   See: WINDOWS_HOTKEY_SETUP.md")
    else:
        print("❌ Some checks failed. See messages above.")
        print()
        print("Common fixes:")
        print("- Install WhisperX: pip3 install whisperx --user")
        print("- Configure HF token: See HUGGINGFACE_SETUP.md")
        print("- Missing dependencies: pip3 install -r requirements.txt")

    print("=" * 60)

    return 0 if all(checks) else 1


if __name__ == "__main__":
    sys.exit(main())
