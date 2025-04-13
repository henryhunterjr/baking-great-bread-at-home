
@echo off
echo Starting development server...

:: Project root directory
set ROOT_DIR=%~dp0..
set NODE_MODULES=%ROOT_DIR%\node_modules
set VITE_BIN=%NODE_MODULES%\.bin\vite.cmd
set VITE_CLI=%NODE_MODULES%\vite\bin\vite.js

:: Check if vite exists in node_modules
if exist "%VITE_BIN%" (
  echo Using local Vite binary...
  call "%VITE_BIN%"
  exit /b %errorlevel%
)

:: Check if vite module exists
if exist "%VITE_CLI%" (
  echo Using Vite CLI module...
  node "%VITE_CLI%"
  exit /b %errorlevel%
)

:: Try with npx
where npx >nul 2>&1
if %errorlevel% equ 0 (
  echo Using npx Vite...
  npx vite
  if %errorlevel% equ 0 exit /b 0
  echo npx vite failed with exit code %errorlevel%
)

:: Try with global vite
where vite >nul 2>&1
if %errorlevel% equ 0 (
  echo Using global Vite...
  vite
  if %errorlevel% equ 0 exit /b 0
  echo Global vite failed with exit code %errorlevel%
)

:: If we got here, none of the methods worked, so install vite
echo Vite not found. Installing Vite...
call npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1

:: Try again with the installed version
if exist "%VITE_BIN%" (
  echo Using newly installed Vite...
  call "%VITE_BIN%"
  exit /b %errorlevel%
) else if exist "%VITE_CLI%" (
  echo Using newly installed Vite CLI...
  node "%VITE_CLI%"
  exit /b %errorlevel%
) else (
  echo Failed to find Vite after installation.
  echo Try running one of these commands:
  echo 1. node scripts/run-vite-direct.js
  echo 2. npx vite
  echo 3. npm install --save-dev vite@4.5.1 @vitejs/plugin-react
  exit /b 1
)
