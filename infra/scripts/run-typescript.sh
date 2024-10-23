#!/bin/bash

# Set up NVM and Node environment
export NVM_DIR="/api/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct Node version
nvm use 20.10.0

# Set up TypeScript environment
export PATH="/usr/local/bin/ts-5.6.3/typescript/node_modules/.bin:$PATH"

# Run the TypeScript file
tsx --tsconfig /usr/local/bin/ts-5.6.3/typescript/tsconfig.json "$1"