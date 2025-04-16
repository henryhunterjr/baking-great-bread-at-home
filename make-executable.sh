
#!/bin/bash

echo "Making scripts executable..."

# Make shell scripts executable
chmod +x start-dev.sh
chmod +x scripts/start-dev.sh
chmod +x scripts/run-dev.sh
chmod +x scripts/start-direct.sh
chmod +x scripts/make-executable.sh
chmod +x scripts/robust-dev.js

echo "Scripts are now executable. You can run the application with:"
echo "  node start.js"
echo "  or"
echo "  bash start-dev.sh"
echo "  or"
echo "  node scripts/robust-dev.js"
