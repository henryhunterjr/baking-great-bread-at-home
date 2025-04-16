
#!/bin/bash

echo "Making scripts executable..."

# Make shell scripts executable
chmod +x run-dev.js
chmod +x scripts/fix-and-run.js
chmod +x scripts/fix-vite.js
chmod +x scripts/run-vite-direct.js
chmod +x scripts/robust-dev.js
chmod +x scripts/start-dev.js
chmod +x scripts/direct-vite.js
chmod +x start.js
chmod +x start-dev.sh
chmod +x scripts/start-dev.sh
chmod +x scripts/run-dev.sh
chmod +x scripts/start-direct.sh

# Make sure npm has the right permissions
npm config set unsafe-perm true

echo "Scripts are now executable. You can run the application with:"
echo "  node run-dev.js"
echo "  or"
echo "  node scripts/fix-and-run.js"
echo ""
echo "If you encounter issues, try running:"
echo "  npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1"
echo "  then"
echo "  npx vite"
