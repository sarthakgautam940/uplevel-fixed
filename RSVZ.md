# RSVZ — Repository Switching Via Zip Contents

RSVZ replaces the entire repository contents with the contents of a zip file while preserving git history.

## Usage

1. Place `smartplay-v3-complete.zip` in the workspace root.
2. Run: `./rsvz.sh`
3. Push: `git push -u origin cursor/repository-file-deletion-2aa1`

With a custom path: `./rsvz.sh /path/to/your.zip`

## What it does

1. Extracts the zip to a temp directory
2. Flattens if the zip has a single project root (e.g. `smartplay-v3-complete/smartplay/` → repo root)
3. Removes current tracked files
4. Copies extracted contents into the repo
5. Commits with message `RSVZ: Replace repository with zip contents`

## Requirements

- `unzip` must be installed
