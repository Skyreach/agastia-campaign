# Windows Hotkey Setup Guide

Set up `Win + Alt + R` to quickly transcribe audio files.

## Quick Setup (3 steps)

### Step 1: Create Shortcut

1. **Navigate to scripts folder**
   ```
   C:\dnd\tools\transcription\scripts\
   ```

2. **Right-click `transcribe_windows.bat`**
   - Select "Create shortcut"
   - A file named `transcribe_windows.bat - Shortcut` will appear

3. **Move shortcut to Start Menu**
   - Cut (Ctrl+X) the shortcut
   - Navigate to:
     ```
     C:\Users\YOUR_USERNAME\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\
     ```
   - Paste (Ctrl+V)
   - Rename to something short like `Transcribe Audio`

**Why?** Windows can only assign hotkeys to shortcuts in the Start Menu.

---

### Step 2: Assign Hotkey

1. **Right-click the shortcut** (in Start Menu folder)
   - Select "Properties"

2. **Click in the "Shortcut key" field**
   - Press: `Win + Alt + R` on your keyboard
   - Field should show: `Ctrl + Alt + R` (Windows adds Ctrl automatically)

3. **Click "Apply" then "OK"**

---

### Step 3: Test It

1. **Press `Win + Alt + R` anywhere in Windows**
   - File picker dialog should open

2. **Select an audio file**
   - Supports: MP3, WAV, M4A, OGG

3. **Wait for transcription**
   - Console window shows progress
   - Completes when you see "Transcription complete!"

---

## Alternative Hotkey Combinations

If `Win + Alt + R` doesn't work or conflicts:

Try these alternatives:
- `Ctrl + Alt + T` (T for Transcribe)
- `Ctrl + Alt + A` (A for Audio)
- `Ctrl + Shift + T`

**To change:** Just press a different combination in Step 2.

---

## Troubleshooting

### Hotkey doesn't work

**Check 1: Run as Administrator**
- Right-click shortcut → Properties
- Click "Advanced..."
- Check "Run as administrator"
- Click OK, Apply, OK

**Check 2: Shortcut location**
- Must be in: `%AppData%\Microsoft\Windows\Start Menu\Programs\`
- NOT in: Desktop, Documents, or original scripts folder

**Check 3: Another program using hotkey**
- Try different hotkey combination
- Close programs that might use same hotkey

### File picker doesn't open

**Check batch file path:**
1. Right-click shortcut → Properties
2. "Target" should be:
   ```
   C:\dnd\tools\transcription\scripts\transcribe_windows.bat
   ```
3. "Start in" should be:
   ```
   C:\dnd\tools\transcription\scripts\
   ```

### Python not found error

**Install Python 3:**
1. Download from https://python.org
2. Run installer
3. **CHECK "Add Python to PATH"**
4. Restart computer

---

## Advanced: Custom Hotkey Script

For more control, use AutoHotkey:

1. **Install AutoHotkey**
   - Download from https://autohotkey.com

2. **Create script** (`transcribe.ahk`):
   ```ahk
   #!r::  ; Win+Alt+R
   Run, C:\dnd\tools\transcription\scripts\transcribe_windows.bat
   return
   ```

3. **Run script**
   - Double-click `transcribe.ahk`
   - Add to Windows Startup folder for auto-start

---

## Pass File Path Directly

You can also:

**Drag & Drop:**
- Drag audio file onto `transcribe_windows.bat`

**Command Line:**
```cmd
transcribe_windows.bat "C:\path\to\audio.mp3"
```

**Right-Click Menu (Advanced):**
Add "Transcribe Audio" to right-click menu:

1. Open Registry Editor (`Win + R` → `regedit`)
2. Navigate to:
   ```
   HKEY_CLASSES_ROOT\*\shell
   ```
3. Create key: `Transcribe Audio`
4. Create subkey: `command`
5. Set default value:
   ```
   C:\dnd\tools\transcription\scripts\transcribe_windows.bat "%1"
   ```

Now right-click any file → "Transcribe Audio"

---

## Summary

- [x] Create shortcut in Start Menu
- [x] Assign `Win + Alt + R` hotkey
- [x] Test with audio file
- [x] (Optional) Add to right-click menu
- [x] (Optional) Auto-start with Windows

**Setup Time: 5 minutes**
