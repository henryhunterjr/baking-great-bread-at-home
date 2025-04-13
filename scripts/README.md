
# Development Scripts

This directory contains scripts to help run the development server, especially when there are issues with the Vite installation.

## Running the Development Server

### On Unix-like systems (Linux/Mac)

```bash
# Option 1: Using the shell script
bash scripts/start-dev.sh

# Option 2: Using the Node.js script
node scripts/run-vite-direct.js
```

### On Windows

```cmd
# Option 1: Using the batch script
scripts\start-dev.bat

# Option 2: Using the Node.js script
node scripts\run-vite-direct.js
```

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

- **run-vite-direct.js**: Node.js script that tries multiple methods to run Vite
- **start-dev.sh**: Shell script for Unix-like systems that tries multiple methods to run Vite
- **start-dev.bat**: Batch script for Windows that tries multiple methods to run Vite
