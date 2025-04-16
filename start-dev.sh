
#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Starting Development Server    ${NC}"
echo -e "${BLUE}================================${NC}"

# Make the script executable
chmod +x start-dev.sh

# Check if we need to install dependencies
if [ ! -d "node_modules" ] || [ ! -d "node_modules/vite" ]; then
  echo -e "${YELLOW}Vite not found. Installing dependencies...${NC}"
  npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install via npm. Trying with node scripts...${NC}"
    node scripts/fix-vite.js
  fi
fi

# First try with node scripts/dev.js (the most robust option)
echo -e "${GREEN}Starting with robust dev script...${NC}"
node scripts/dev.js

# If that fails, try direct methods
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}First method failed. Trying direct Vite execution...${NC}"
  node scripts/run-vite-direct.js
fi

# If that also fails, try npx directly
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Second method failed. Trying with npx vite...${NC}"
  npx vite
fi
