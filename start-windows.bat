
@echo off
echo Starting Windows Development Setup...

:: Install Vite directly first
echo Installing Vite and React plugin...
call npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1

:: Try different methods to start Vite
echo Attempting to start Vite development server...

:: Method 1: Try with local binary
if exist "node_modules\.bin\vite.cmd" (
  echo Using local Vite binary...
  call node_modules\.bin\vite.cmd
  if %errorlevel% equ 0 goto :success
  echo Local binary failed, trying next method...
)

:: Method 2: Try with npx
echo Using npx Vite...
call npx vite
if %errorlevel% equ 0 goto :success
echo NPX method failed, trying next method...

:: Method 3: Try direct node execution
if exist "node_modules\vite\bin\vite.js" (
  echo Using Vite module directly...
  node node_modules\vite\bin\vite.js
  if %errorlevel% equ 0 goto :success
  echo Direct node execution failed, trying next method...
)

:: Method 4: Try global vite
echo Using global Vite command...
vite
if %errorlevel% equ 0 goto :success

:: If we get here, all methods failed
echo All standard methods failed.
echo Trying one last approach: direct NPX with verbose logging...
call npx --loglevel=verbose vite
if %errorlevel% equ 0 goto :success

echo.
echo ===================================
echo ERROR: Failed to start development server!
echo.
echo Please try the following:
echo 1. Run: npm install -g vite
echo 2. Run: vite
echo.
echo Alternatively, try: npm run dev
echo ===================================
exit /b 1

:success
echo Development server started successfully!
exit /b 0
