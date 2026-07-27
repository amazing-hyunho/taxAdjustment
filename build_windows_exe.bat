@echo off
setlocal

REM Build one-file Windows executable for Local CSV Viewer

if not exist .venv (
  py -m venv .venv
)

call .venv\Scripts\python -m pip install --upgrade pip
call .venv\Scripts\python -m pip install -r requirements.txt pyinstaller

if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
if exist LocalCsvViewer.spec del /q LocalCsvViewer.spec

call .venv\Scripts\python -m PyInstaller ^
  --name LocalCsvViewer ^
  --onefile ^
  --noconsole ^
  --add-data "app.py;." ^
  --add-data "db.py;." ^
  --add-data "ingest.py;." ^
  --add-data "requirements.txt;." ^
  launcher.py

if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo.
echo Build success: dist\LocalCsvViewer.exe
echo Run it and open http://127.0.0.1:8501 in your browser.
endlocal
