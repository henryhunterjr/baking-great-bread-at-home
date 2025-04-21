
# Development Server Setup

This project contains several scripts to help start the development server across different environments.

## Quick Start

The easiest way to start the development server is by running:

```
node start.js
```

This script will automatically:
1. Check if Vite is installed
2. Install it if needed
3. Start the development server using the best available method for your system

## Alternative Methods

If you encounter issues with the main script, you can try these alternatives:

### Direct NPX method
```
npx vite
```

### Using our robust script
```
node scripts/run-vite-direct.js
```

### Manual installation
```
npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
npx vite
```

## Troubleshooting

If you continue to encounter issues:

1. Make sure Node.js is properly installed and up to date
2. Try installing Vite globally: `npm install -g vite`
3. Check if there are any permission issues preventing script execution
4. Clear your npm cache: `npm cache clean --force` and try again
