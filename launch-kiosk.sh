#!/usr/bin/env bash
# ==============================================================================
# Script de lancement Kiosk (Raspberry Pi / Cage / Wayland)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_URI="file://$DIR/index.html?duration=600&autoexit=1"

# S'assurer que XDG_RUNTIME_DIR est défini (ex: lancement manuel via SSH)
if [ -z "${XDG_RUNTIME_DIR:-}" ]; then
    if [ -d "/run/user/$(id -u)" ] && [ -w "/run/user/$(id -u)" ]; then
        export XDG_RUNTIME_DIR="/run/user/$(id -u)"
    else
        export XDG_RUNTIME_DIR="/tmp/xdg-runtime-$(id -u)"
        mkdir -p "$XDG_RUNTIME_DIR"
        chmod 700 "$XDG_RUNTIME_DIR"
    fi
fi

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
    "--disable-features=Translate"
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
