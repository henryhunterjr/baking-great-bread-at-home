
#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development server...${NC}"

# Make the script executable
chmod +x start-dev.sh

# Check if we need to install dependencies
if [ ! -d "node_modules" ] || [ ! -d "node_modules/vite" ]; then
  echo -e "${YELLOW}Vite not found. Installing dependencies...${NC}"
  npm install
fi

# Try running vite directly with npx
echo "Starting Vite development server..."
npx vite

# If npx vite fails, try with node
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}npx vite failed. Trying with node...${NC}"
  
  # Check if vite exists in node_modules
  if [ -f "node_modules/vite/bin/vite.js" ]; then
    echo "Running vite directly from node_modules..."
    node node_modules/vite/bin/vite.js
  else
    echo -e "${RED}Vite not found in node_modules. Installing vite...${NC}"
    npm install --save-dev vite@latest @vitejs/plugin-react@latest
    
    # Try again after installation
    echo "Trying with npx vite after installation..."
    npx vite
  fi
fi
