
# Development Server Setup

This project contains several scripts to help start the development server across different environments.

## Quick Start

The easiest way to start the development server is by running:

```
node install-and-run.js
```

This new script is the most robust option and will try multiple methods to start the server.

## Troubleshooting

If you're experiencing persistent issues with the development server not starting, we've added diagnostic tools:

```
node debug-vite.js
```

This diagnostic script will:
1. Check your Node.js environment
2. Verify Vite installation status
3. Look for common configuration issues
4. Attempt to fix and start the server
5. Provide detailed error reporting

For platform-specific diagnostics, you can use:
- Windows: `start-diagnostic.bat`
- Mac/Linux: `./start-diagnostic.sh` (may need to run `chmod +x start-diagnostic.sh` first)

### Common Issues

If you continue to encounter issues:

1. Make sure Node.js is properly installed and up to date
2. Try installing Vite globally: `npm install -g vite`
3. Check if there are any permission issues preventing script execution
4. Clear your npm cache: `npm cache clean --force` and try again
5. Verify that your PATH environment variable includes npm's bin directory

## Alternative Methods

If the diagnostic tools don't solve your issue, you can try these alternatives:

### Direct NPX method
```
npx vite
```

### Manual installation
```
npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
npx vite
```

### Direct Node.js execution
```
node ./node_modules/vite/bin/vite.js
```

## WebSocket Connection Errors

The WebSocket connection errors in the console are normal during development and don't affect core functionality. These connections have been disabled to reduce console noise.
