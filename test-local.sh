#!/usr/bin/env bash
# ==============================================================================
# Script de test local pour LCD Gym Screensaver
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_FILE="$DIR/index.html"

# Détection du navigateur disponible
BROWSER=""
for b in google-chrome chromium-browser chromium brave-browser firefox xdg-open; do
    if command -v "$b" >/dev/null 2>&1; then
        BROWSER="$b"
        break
    fi
done

if [ -z "$BROWSER" ]; then
    echo "❌ Aucun navigateur trouvé. Ouvrez directement le fichier :"
    echo "   file://$INDEX_FILE"
    exit 1
fi

MODE="${1:-demo}"

echo "=========================================================="
echo "   🏋️  LANCEMENT DU BANC DE TEST : LCD GYM SCREENSAVER"
echo "=========================================================="
echo "Navigateur détecté : $BROWSER"

case "$MODE" in
    --demo|-d|demo)
        echo "Mode sélectionné    : DEMO ACCÉLÉRÉE (60 secondes, 5x, HUD actif)"
        URL="file://$INDEX_FILE?duration=60&speed=5&hud=1"
        ;;
    --normal|-n|normal)
        echo "Mode sélectionné    : CONDITIONS RÉELLES (10 minutes, vitesse 1x, HUD actif)"
        URL="file://$INDEX_FILE?duration=600&speed=1&hud=1"
        ;;
    --kiosk|-k|kiosk)
        echo "Mode sélectionné    : PLEIN ÉCRAN KIOSK (10 minutes)"
        URL="file://$INDEX_FILE?duration=600&speed=1"
        if [ "$BROWSER" = "chromium" ] || [ "$BROWSER" = "google-chrome" ] || [ "$BROWSER" = "chromium-browser" ]; then
            exec "$BROWSER" --kiosk --noerrdialogs --disable-infobars --disable-sync --disable-background-networking --log-level=3 "$URL"
        fi
        ;;
    *)
        echo "Usage: ./test-local.sh [demo | normal | kiosk]"
        echo "  demo    : 60 secondes en avance rapide 5x (Idéal pour vérifier les transitions)"
        echo "  normal  : 10 minutes en vitesse réelle 1x avec HUD"
        echo "  kiosk   : 10 minutes en mode plein écran sans curseur"
        exit 0
        ;;
esac

echo ""
echo "Raccourcis clavier pendant le test :"
echo "  • [Espace] : Pause / Reprise"
echo "  • [B]      : Forcer la phase Barres"
echo "  • [S]      : Forcer la phase Aplats de couleurs"
echo "  • [N]      : Prochain message et saut aléatoire"
echo "  • [->]     : Avancer de 30 secondes"
echo "  • [F]      : Basculer en Plein Écran"
echo "  • [H]      : Masquer/Afficher le HUD"
echo "  • [R]      : Recommencer depuis le début"
echo ""
echo "Ouverture : $URL"

if [ "$BROWSER" = "chromium" ] || [ "$BROWSER" = "google-chrome" ] || [ "$BROWSER" = "chromium-browser" ]; then
    # Ouvre dans une fenêtre applicative propre sans barre d'adresse et sans bruit de log
    "$BROWSER" --app="$URL" --disable-sync --disable-background-networking --log-level=3 >/dev/null 2>&1 &
else
    "$BROWSER" "$URL" >/dev/null 2>&1 &
fi

echo "✅ Lancé en arrière-plan."
