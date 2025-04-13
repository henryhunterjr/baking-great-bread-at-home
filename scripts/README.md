
# Development Scripts

This directory contains scripts to help run the development server, especially when there are issues with the Vite installation.

## Running the Development Server

### The Easiest Way

```bash
# This script will try multiple methods to run Vite
node scripts/dev.js
```

### Alternative Methods

If the easy way doesn't work, you have several alternatives:

#### On Unix-like systems (Linux/Mac)

```bash
# Option 1: Using the shell script
bash scripts/start-dev.sh

# Option 2: Using the direct script
node scripts/run-vite-direct.js
```

#### On Windows

```cmd
# Option 1: Using the batch script
scripts\start-dev.bat

# Option 2: Using the direct script
node scripts\run-vite-direct.js
```

## Fixing Vite Issues

If you're having trouble with Vite, try the fix script:

```
node scripts/fix-vite.js
```

This script will:
1. Clean up any broken Vite installation
2. Install Vite with the correct version
3. Create backup executable scripts
4. Verify that Vite is accessible

## Troubleshooting

If you're still having issues running Vite:

1. Try installing Vite directly:
   ```
   npm install --save-dev vite@4.5.1 @vitejs/plugin-react
   ```

2. Then run the development server:
   ```
   npx vite
   ```

3. If that fails, make sure Node.js is properly installed and your npm is up to date:
   ```
   npm install -g npm
   ```

## Scripts Description

- **dev.js**: Main script for starting the development server
- **fix-vite.js**: Script to fix Vite installation issues
- **run-vite-direct.js**: Direct script to run Vite with fallback mechanisms
- **start-dev.sh**: Shell script for Unix-like systems
- **start-dev.bat**: Batch script for Windows

