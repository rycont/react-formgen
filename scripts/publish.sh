#!/bin/bash

# Navigate to monorepo root
cd "$(dirname "$0")/.."

# Verify npm auth
if ! npm whoami &> /dev/null; then
  echo "Not logged in to npm. Run \`npm login\` first."
  exit 1
fi

# Traverse each workspace in packages/ and publish
echo "Publishing all packages in packages/…"
for pkg in packages/*; do
  if [ -f "$pkg/package.json" ]; then
    echo "→ Publishing $(basename "$pkg")"
    (
      cd "$pkg" || exit
      npm publish
    )
  else
    echo "→ Skipping $(basename "$pkg") (no package.json)"
  fi
done

echo "All done."
