
#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development server...${NC}"

# Project root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_MODULES="$ROOT_DIR/node_modules"
VITE_BIN="$NODE_MODULES/.bin/vite"
VITE_CLI="$NODE_MODULES/vite/bin/vite.js"

# Make the script executable if it isn't already
chmod +x "$0"

# Check if vite exists in node_modules
if [ -f "$VITE_BIN" ]; then
  echo -e "${GREEN}Using local Vite binary...${NC}"
  "$VITE_BIN"
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  else
    echo -e "${YELLOW}Local Vite binary failed with exit code $EXIT_CODE. Trying next method...${NC}"
  fi
fi

# Check if vite module exists
if [ -f "$VITE_CLI" ]; then
  echo -e "${GREEN}Using Vite CLI module...${NC}"
  node "$VITE_CLI"
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  else
    echo -e "${YELLOW}Vite CLI module failed with exit code $EXIT_CODE. Trying next method...${NC}"
  fi
fi

# Try with npx
if command -v npx &>/dev/null; then
  echo -e "${GREEN}Using npx Vite...${NC}"
  npx vite
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  else
    echo -e "${YELLOW}npx vite failed with exit code $EXIT_CODE. Trying next method...${NC}"
  fi
fi

# Try with global vite
if command -v vite &>/dev/null; then
  echo -e "${GREEN}Using global Vite...${NC}"
  vite
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  else
    echo -e "${YELLOW}Global vite failed with exit code $EXIT_CODE. Trying next method...${NC}"
  fi
fi

# If we got here, none of the methods worked, so install vite
echo -e "${YELLOW}Vite not found or not working. Installing Vite...${NC}"
npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1

# Try again with the installed version
if [ -f "$VITE_BIN" ]; then
  echo -e "${GREEN}Using newly installed Vite...${NC}"
  "$VITE_BIN"
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  fi
elif [ -f "$VITE_CLI" ]; then
  echo -e "${GREEN}Using newly installed Vite CLI...${NC}"
  node "$VITE_CLI"
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Vite completed successfully!${NC}"
    exit 0
  fi
else
  echo -e "${RED}Failed to find Vite after installation.${NC}"
  echo -e "${YELLOW}Try running one of these commands:${NC}"
  echo "1. node scripts/run-vite-direct.js"
  echo "2. npx vite"
  echo "3. npm install --save-dev vite@4.5.1 @vitejs/plugin-react"
  exit 1
fi
