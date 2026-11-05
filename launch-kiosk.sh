#!/usr/bin/env bash
# ==============================================================================
# Script de lancement Kiosk (Raspberry Pi / Cage / Wayland)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_URI="file://$DIR/index.html?duration=600&autoexit=1"

# Détection de Chromium
CHROME_BIN=""
for b in /usr/bin/chromium-browser /usr/bin/chromium /snap/bin/chromium; do
    if [ -x "$b" ]; then
        CHROME_BIN="$b"
        break
    fi
done

if [ -z "$CHROME_BIN" ]; then
    CHROME_BIN="chromium-browser"
fi

# Options Chromium pour Wayland natif et plein écran absolu sans dialogue
CHROME_FLAGS=(
    "--kiosk"
    "--no-first-run"
    "--no-default-browser-check"
    "--noerrdialogs"
    "--disable-infobars"
    "--hide-scrollbars"
    "--disable-sync"
    "--disable-background-networking"
    "--log-level=3"
    "--enable-features=UseOzonePlatform"
    "--ozone-platform=wayland"
    "--autoplay-policy=no-user-gesture-required"
    "$INDEX_URI"
)

# Lancement avec Cage (compositeur Wayland kiosque)
if command -v cage >/dev/null 2>&1; then
    exec cage -- "$CHROME_BIN" "${CHROME_FLAGS[@]}"
else
    exec "$CHROME_BIN" "${CHROME_FLAGS[@]}"
fi
