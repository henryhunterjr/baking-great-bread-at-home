
#!/bin/bash

# Make sure the script is executable
# chmod +x scripts/run-dev.sh

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Starting Development Server    ${NC}"
echo -e "${BLUE}================================${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
  npm install
fi

# Check if vite is installed
if [ ! -f "node_modules/.bin/vite" ]; then
  echo -e "${YELLOW}Vite binary not found. Running fix script...${NC}"
  node scripts/fix-vite.js
fi

# Copy PDF resources
echo -e "${BLUE}Setting up PDF resources...${NC}"
node scripts/copy-pdf-resources.js

# Start the dev server using our custom script
echo -e "${GREEN}Starting development server...${NC}"
node scripts/start-dev.js

# In case of error, provide helpful message
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to start development server!${NC}"
  echo -e "${YELLOW}Try running these commands manually:${NC}"
  echo -e "1. node scripts/fix-vite.js"
  echo -e "2. npm install"
  echo -e "3. node scripts/start-dev.js"
  exit 1
fi
