
#!/bin/bash

echo "Making scripts executable..."

# Make shell scripts executable
chmod +x start-dev.sh
chmod +x scripts/start-dev.sh
chmod +x scripts/run-dev.sh
chmod +x scripts/start-direct.sh
chmod +x scripts/make-executable.sh
chmod +x scripts/robust-dev.js
chmod +x scripts/fix-and-run.js
chmod +x run-dev.js
chmod +x scripts/fix-vite.js

echo "Scripts are now executable. You can run the application with:"
echo "  node run-dev.js"
echo "  or"
echo "  node scripts/fix-and-run.js"
echo "  or"
echo "  node start.js"
