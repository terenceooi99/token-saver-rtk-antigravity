#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
GLOBAL_SKILLS_DIR="$HOME/.gemini/config/skills"

mkdir -p "$GLOBAL_SKILLS_DIR"

SKILLS=("rtk-savedtokenon" "rtk-savedtokenoff" "rtk-gain")

for skill in "${SKILLS[@]}"; do
    SRC="$PROJECT_ROOT/skills/$skill"
    DEST="$GLOBAL_SKILLS_DIR/$skill"
    if [ -d "$SRC" ]; then
        mkdir -p "$DEST"
        cp -R "$SRC/"* "$DEST/"
        echo "[OK] Installed skill: /$skill -> $DEST"
    fi
done

echo ""
echo "Token Saver (RTK) skills installed successfully!"
echo "You can now type / in any Antigravity IDE chat to access slash commands."