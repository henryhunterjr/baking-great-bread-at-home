
#!/bin/bash

echo "Starting Vite directly through NPX..."
npx vite "$@"

if [ $? -ne 0 ]; then
  echo "Failed to start Vite. Trying global Vite..."
  vite "$@"
  
  if [ $? -ne 0 ]; then
    echo "Global Vite failed too. Installing and trying again..."
    npm install --save-dev vite@4.5.1 @vitejs/plugin-react
    npx vite "$@"
  fi
fi
