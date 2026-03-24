#!/bin/bash
# RSVZ - Repository Switching Via Zip Contents
# Extracts a zip file and replaces the repository contents with its contents.
#
# Usage: ./rsvz.sh [path-to-zip]
# Default zip: ./smartplay-v3-complete.zip

set -e

REPO_ROOT="/workspace"
ZIP_FILE="${1:-$REPO_ROOT/smartplay-v3-complete.zip}"

if [ ! -f "$ZIP_FILE" ]; then
  echo "Error: Zip file not found: $ZIP_FILE"
  echo "Place smartplay-v3-complete.zip in the workspace, then run: ./rsvz.sh"
  exit 1
fi

cd "$REPO_ROOT"
EXTRACT_DIR=$(mktemp -d)

echo "[RSVZ] Extracting $ZIP_FILE..."
unzip -o -q "$ZIP_FILE" -d "$EXTRACT_DIR"

# If zip had a single root folder, use it (common when zipping a project folder)
EXTRACTED=("$EXTRACT_DIR"/*)
if [ ${#EXTRACTED[@]} -eq 1 ] && [ -d "${EXTRACTED[0]}" ]; then
  INNER="${EXTRACTED[0]}"
  if [ -f "$INNER/package.json" ] || [ -d "$INNER/src" ] || [ -f "$INNER/README.md" ]; then
    echo "[RSVZ] Using single project root from zip..."
    SRCDIR="$INNER"
  else
    SRCDIR="$EXTRACT_DIR"
  fi
else
  SRCDIR="$EXTRACT_DIR"
fi

echo "[RSVZ] Replacing repository contents..."
git ls-files | xargs -r git rm -rf --cached 2>/dev/null || true
ZIP_BASENAME=$(basename "$ZIP_FILE")
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name "$ZIP_BASENAME" -exec rm -rf {} + 2>/dev/null || true
cp -a "$SRCDIR"/* "$REPO_ROOT"/ 2>/dev/null || true
cp -a "$SRCDIR"/.[!.]* "$REPO_ROOT"/ 2>/dev/null || true
rm -rf "$EXTRACT_DIR"

echo "[RSVZ] Adding new files..."
git add -A
git status

echo "[RSVZ] Committing..."
git commit -m "RSVZ: Replace repository with zip contents"

echo "[RSVZ] Done. Run 'git push' to push changes."
