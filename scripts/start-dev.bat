
@echo off
echo Starting development server...

:: Set ANSI color codes for Windows
set RESET=[0m
set GREEN=[32m
set YELLOW=[33m
set BLUE=[34m
set RED=[31m

:: Project root directory
set ROOT_DIR=%~dp0..
set NODE_MODULES=%ROOT_DIR%\node_modules
set VITE_BIN=%NODE_MODULES%\.bin\vite.cmd
set VITE_CLI=%NODE_MODULES%\vite\bin\vite.js

:: Enable delayed expansion
setlocal enabledelayedexpansion

echo %BLUE%Checking for Vite installation...%RESET%

:: Check if vite exists in node_modules
if exist "%VITE_BIN%" (
  echo %GREEN%Using local Vite binary...%RESET%
  call "%VITE_BIN%"
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
  echo %YELLOW%Local Vite binary failed with exit code !errorlevel!. Trying next method...%RESET%
)

:: Check if vite module exists
if exist "%VITE_CLI%" (
  echo %GREEN%Using Vite CLI module...%RESET%
  node "%VITE_CLI%"
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
  echo %YELLOW%Vite CLI module failed with exit code !errorlevel!. Trying next method...%RESET%
)

:: Try with npx
echo %BLUE%Trying with npx...%RESET%
where npx >nul 2>&1
if %errorlevel% equ 0 (
  echo %GREEN%Using npx Vite...%RESET%
  npx vite
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
  echo %YELLOW%npx vite failed with exit code !errorlevel!. Trying next method...%RESET%
)

:: Try with global vite
echo %BLUE%Trying with global Vite...%RESET%
where vite >nul 2>&1
if %errorlevel% equ 0 (
  echo %GREEN%Using global Vite...%RESET%
  vite
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
  echo %YELLOW%Global vite failed with exit code !errorlevel!%RESET%
)

:: If we got here, none of the methods worked, so install vite
echo %YELLOW%Vite not found or not working. Installing Vite...%RESET%
call npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1

:: Try again with the installed version
if exist "%VITE_BIN%" (
  echo %GREEN%Using newly installed Vite...%RESET%
  call "%VITE_BIN%"
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
) else if exist "%VITE_CLI%" (
  echo %GREEN%Using newly installed Vite CLI...%RESET%
  node "%VITE_CLI%"
  if !errorlevel! equ 0 (
    echo %GREEN%Vite completed successfully!%RESET%
    exit /b 0
  )
) else (
  echo %RED%Failed to find Vite after installation.%RESET%
  echo Try running one of these commands:
  echo 1. node scripts/run-vite-direct.js
  echo 2. npx vite
  echo 3. npm install --save-dev vite@4.5.1 @vitejs/plugin-react
  exit /b 1
)
