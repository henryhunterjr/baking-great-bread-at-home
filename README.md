
# Development Server Setup

This project contains several scripts to help start the development server across different environments.

## For Windows Users

If you're on Windows, use one of these methods to start the development server:

### Method 1: Using the batch file

```
start-windows.bat
```

### Method 2: Using the Windows-specific Node script

```
node run-dev-windows.js
```

### Method 3: Direct NPX command

```
npx vite
```

## For Mac/Linux Users

If you're on Mac or Linux, use one of these methods:

### Method 1: Make scripts executable and run

```
bash make-executable.sh
node run-dev.js
```

### Method 2: Direct NPX command

```
npx vite
```

## Troubleshooting

If you encounter issues starting the development server:

1. Try installing Vite globally:
   ```
   npm install -g vite
   vite
   ```

2. Make sure Node.js is properly installed and up to date.

3. Try installing dependencies directly:
   ```
   npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
   npx vite
   ```

4. Check if there are any permission issues that might prevent script execution.
