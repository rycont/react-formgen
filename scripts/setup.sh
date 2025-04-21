#!/bin/bash

# Navigate to the root directory of the monorepo
cd "$(dirname "$0")/.."

# Directories to clean
dirs=(
  "packages/core"
  "packages/json-schema"
  "packages/yup"
  "packages/zod"
  "website"
)

# Remove node_modules in each target
echo "Cleaning old node_modules directories..."
for d in "${dirs[@]}"; do
  if [ -d "$d/node_modules" ]; then
    echo "  → Removing $d/node_modules"
    rm -rf "$d/node_modules"
  else
    echo "  → No node_modules found in $d"
  fi
done

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "pnpm is not installed. Please install it globally using the following command:"
  echo "  npm install -g pnpm"
  exit 1
fi

# Install dependencies for all directories
echo "Installing dependencies for all directories..."
pnpm install

# Build the project packages
echo "Building the project packages..."
pnpm build

