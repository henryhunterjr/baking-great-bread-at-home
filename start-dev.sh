
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

# Try different methods to start Vite, in order of preference

# First try with our robust script
echo -e "${GREEN}Starting with robust script...${NC}"
node scripts/robust-dev.js

# If that fails, try with legacy script
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Robust script failed. Trying with node scripts...${NC}"
  node scripts/dev.js
fi

# If that fails, try direct methods
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Legacy script failed. Trying direct Vite execution...${NC}"
  node scripts/run-vite-direct.js
fi

# If that also fails, try npx directly
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Direct execution failed. Trying with npx vite...${NC}"
  npx vite
fi

# If all methods fail, try installing vite first
if [ $? -ne 0 ]; then
  echo -e "${RED}All methods failed. Attempting to install Vite and try again...${NC}"
  npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
  npx vite
fi
