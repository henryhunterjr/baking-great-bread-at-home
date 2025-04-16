
#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting development server...${NC}"

# Make the script executable
chmod +x start-dev.sh

# Try our robust development script first
echo "Running robust development script..."
node scripts/robust-dev.js

# If that fails, try direct methods
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}Robust script failed. Trying direct methods...${NC}"
  
  # Try npx vite
  echo "Trying npx vite..."
  npx vite
  
  # If that fails too, try installing and running
  if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Installing vite and trying again...${NC}"
    npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1
    npx vite
  fi
fi
