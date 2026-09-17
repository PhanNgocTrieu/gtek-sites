@echo off
setlocal
cd /d "%~dp0"

where bash >nul 2>&1
if %ERRORLEVEL%==0 (
  bash "%~dp0setup.sh" %*
  exit /b %ERRORLEVEL%
)

where wsl >nul 2>&1
if %ERRORLEVEL%==0 (
  wsl -e bash "./setup.sh" %*
  exit /b %ERRORLEVEL%
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1" %*
exit /b %ERRORLEVEL%
