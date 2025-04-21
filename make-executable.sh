
#!/bin/bash

echo "Making scripts executable..."

# Make scripts executable
chmod +x start.js
chmod +x scripts/run-vite-direct.js

echo "Scripts are now executable. You can run the application with:"
echo "  node start.js"
echo ""
echo "If you encounter issues, try running:"
echo "  npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1"
echo "  then"
echo "  npx vite"
