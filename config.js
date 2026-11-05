/**
 * Configuration par défaut pour le projet LCD Gym Screensaver
 * Toutes ces valeurs peuvent être surchargées via des paramètres d'URL (ex: ?duration=60&speed=5)
 */
window.LCD_GYM_CONFIG = {
    // Durée totale du cycle en secondes (10 minutes = 600s)
    durationSeconds: 600,

    // Durée de chaque phase (30 secondes barres, 30 secondes aplats)
    phaseIntervalSeconds: 30,

    // Durée d'affichage de chaque couleur en phase solide (5 secondes)
    solidColorIntervalSeconds: 5,

    // Fréquence de saut et rotation du message (10 secondes)
    messageJumpIntervalSeconds: 10,

    // Palette des couleurs de dépolarisation (RVB + Noir & Blanc)
    colors: [
        '#FFFFFF',
        '#000000',
        '#FF0000',
        '#00FF00',
        '#0000FF'
    ],

    // Messages rassurants en rotation (sans émojis, accents français)
    messages: [
        "Je fais ma gym après un bon café",
        "Étirement des pixels en cours, tout va bien",
        "Séance de fitness quotidienne de l'écran",
        "L'écran fait son jogging"
    ],

    // Texte d'accompagnement
    subtitlePrefix: "Maintenance préventive de l'écran — Mise en veille dans",

    // Action à la fin du cycle (fermeture de fenêtre si en mode kiosk ou écran noir)
    autoExitOnFinish: false
};
