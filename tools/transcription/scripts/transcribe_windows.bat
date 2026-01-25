@echo off
REM Windows Batch Script for Audio Transcription
REM Can be triggered via keyboard shortcut

setlocal enabledelayedexpansion

REM ===== CONFIGURATION =====
REM Default Python executable (adjust if needed)
set "PYTHON=python3"

REM Path to transcription script (relative to this batch file)
set "SCRIPT_DIR=%~dp0"
set "TRANSCRIBE_SCRIPT=%SCRIPT_DIR%transcribe.py"

REM Default whisper model size
set "MODEL=base"

REM Output directory (adjust to your preference)
set "OUTPUT_DIR=%SCRIPT_DIR%..\outputs"
REM ===== END CONFIGURATION =====

echo ================================================
echo Audio Transcription Tool
echo ================================================
echo.

REM Check if a file path was provided as argument
if "%~1"=="" (
    REM No argument - open file picker
    echo Opening file picker...
    powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $dialog = New-Object System.Windows.Forms.OpenFileDialog; $dialog.Filter = 'Audio Files (*.mp3;*.wav;*.m4a;*.ogg)|*.mp3;*.wav;*.m4a;*.ogg|All Files (*.*)|*.*'; $dialog.Title = 'Select Audio File to Transcribe'; if ($dialog.ShowDialog() -eq 'OK') { $dialog.FileName }" > "%TEMP%\selected_file.txt"

    set /p AUDIO_FILE=<"%TEMP%\selected_file.txt"
    del "%TEMP%\selected_file.txt" 2>nul

    if "!AUDIO_FILE!"=="" (
        echo No file selected. Exiting.
        timeout /t 3 >nul
        exit /b 1
    )
) else (
    REM File path provided as argument
    set "AUDIO_FILE=%~1"
)

REM Verify file exists
if not exist "!AUDIO_FILE!" (
    echo Error: File not found: !AUDIO_FILE!
    echo.
    pause
    exit /b 1
)

echo Selected file: !AUDIO_FILE!
echo.
echo Starting transcription...
echo This may take several minutes depending on file length.
echo.

REM Run transcription
"%PYTHON%" "%TRANSCRIBE_SCRIPT%" "!AUDIO_FILE!" --model "%MODEL%" --output-dir "%OUTPUT_DIR%" --device cpu

REM Check exit code
if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================
    echo Transcription completed successfully!
    echo ================================================
    echo.
    echo Output saved to: %OUTPUT_DIR%
    echo.

    REM Ask if user wants to open output folder
    set /p OPEN_FOLDER="Open output folder? (y/n): "
    if /i "!OPEN_FOLDER!"=="y" (
        explorer "%OUTPUT_DIR%"
    )
) else (
    echo.
    echo ================================================
    echo Transcription failed with error code: %ERRORLEVEL%
    echo ================================================
    echo.
)

pause
