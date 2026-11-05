/**
 * LCD Gym Screensaver - Moteur d'Animation et Dépolarisation
 * Zéro dépendance (Vanilla JS moderne)
 */

(function () {
    'use strict';

    // 1. Fusion de la configuration avec les paramètres d'URL
    const urlParams = new URLSearchParams(window.location.search);
    const baseConfig = window.LCD_GYM_CONFIG || {};

    const speedMultiplier = Math.max(1, parseFloat(urlParams.get('speed') || '1'));
    const totalDuration = parseInt(urlParams.get('duration') || baseConfig.durationSeconds || '600', 10);
    const phaseInterval = parseInt(urlParams.get('phase') || baseConfig.phaseIntervalSeconds || '30', 10);
    const solidColorInterval = parseInt(urlParams.get('solidInterval') || baseConfig.solidColorIntervalSeconds || '5', 10);
    const jumpInterval = parseInt(urlParams.get('jump') || baseConfig.messageJumpIntervalSeconds || '10', 10);
    const autoExit = urlParams.get('autoexit') === '1' || baseConfig.autoExitOnFinish === true;
    const forceHud = urlParams.get('hud') === '1';

    const colors = baseConfig.colors || ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'];
    const messages = baseConfig.messages || ["Je fais ma gym après un bon café"];
    const subtitlePrefix = baseConfig.subtitlePrefix || "Maintenance préventive de l'écran — Mise en veille dans";

    // 2. Éléments du DOM
    const stage = document.getElementById('canvas-stage');
    const textOverlay = document.getElementById('text-overlay');
    const msgEl = document.getElementById('gym-message');
    const subtitleEl = document.getElementById('gym-subtitle');
    const hudEl = document.getElementById('test-hud');

    // 3. Variables d'état
    let remainingSeconds = totalDuration;
    let elapsedSeconds = 0;
    let currentMessageIndex = 0;
    let isPaused = false;
    let isFinished = false;
    let currentPhase = 'bars'; // 'bars' | 'solid'
    let currentSolidColor = colors[0];

    // 4. Positionnement aléatoire sécurisé du texte (évite les bords d'écran)
    function jumpTextPosition() {
        if (isFinished) return;

        // Positionnement en pourcentage pour s'adapter à toutes les résolutions (4:3, 5:4, 16:9)
        const minTop = 15;
        const maxTop = 68;
        const minLeft = 8;
        const maxLeft = 45;

        const nextTop = Math.floor(minTop + Math.random() * (maxTop - minTop));
        const nextLeft = Math.floor(minLeft + Math.random() * (maxLeft - minLeft));

        textOverlay.style.top = `${nextTop}%`;
        textOverlay.style.left = `${nextLeft}%`;

        // Rotation du message
        msgEl.textContent = messages[currentMessageIndex];
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    }

    // 5. Formatage du temps restant
    function formatRemainingTime(seconds) {
        if (seconds <= 0) return "0 s";
        if (seconds < 60) {
            return `${seconds} s`;
        }
        const mins = Math.ceil(seconds / 60);
        return `${mins} min`;
    }

    // 6. Mise à jour de l'affichage de la phase visuelle
    function updateVisualPhase() {
        if (isFinished) return;

        const cycleTime = elapsedSeconds % (phaseInterval * 2);

        if (cycleTime < phaseInterval) {
            // Phase 1 : Balayage continu de barres RVB/N&B
            if (currentPhase !== 'bars') {
                currentPhase = 'bars';
                stage.className = 'mode-bars';
                stage.style.backgroundColor = '';
            }
        } else {
            // Phase 2 : Aplats successifs plein écran
            if (currentPhase !== 'solid') {
                currentPhase = 'solid';
                stage.className = 'mode-solid';
            }
            const solidElapsed = cycleTime - phaseInterval;
            const colorIndex = Math.floor(solidElapsed / solidColorInterval) % colors.length;
            currentSolidColor = colors[colorIndex];
            stage.style.backgroundColor = currentSolidColor;
        }

        // Mise à jour du sous-titre
        subtitleEl.textContent = `${subtitlePrefix} ${formatRemainingTime(remainingSeconds)}`;
    }

    // 7. Fin du cycle
    function handleFinish() {
        isFinished = true;
        stage.className = 'mode-finished';
        stage.style.backgroundColor = '#000000';
        textOverlay.style.opacity = '0';

        console.log('[LCD Gym] Cycle de régénération terminé. Écran prêt pour extinction HDMI.');

        // Émission d'un événement personnalisé pour d'éventuels scripts hôtes
        const finishEvent = new CustomEvent('lcd-gym-finished', {
            detail: { totalDuration, elapsedSeconds }
        });
        window.dispatchEvent(finishEvent);

        // Notification de la fenêtre parente si intégrée dans une iframe
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'lcd-gym-finished',
                totalDuration,
                elapsedSeconds,
                timestamp: new Date().toISOString()
            }, '*');
        }

        if (autoExit) {
            setTimeout(() => {
                window.close();
            }, 1000);
        }
    }

    // 8. Mise à jour du HUD de test
    function updateHud() {
        if (!hudEl) return;
        document.getElementById('hud-time').textContent = `${elapsedSeconds}s / ${totalDuration}s (reste ${remainingSeconds}s)`;
        document.getElementById('hud-phase').textContent = currentPhase === 'bars' ? 'Barres RVB/N&B (30s)' : `Aplat ${currentSolidColor}`;
        document.getElementById('hud-speed').textContent = `${speedMultiplier}x`;
        document.getElementById('hud-status').textContent = isFinished ? 'TERMINÉ' : (isPaused ? 'EN PAUSE' : 'ACTIF');
    }

    // 9. Boucle principale (cadencée à la seconde réelle ou accélérée via speed)
    function tick() {
        if (isPaused || isFinished) return;

        elapsedSeconds += 1;
        remainingSeconds = Math.max(0, remainingSeconds - 1);

        // Saut de position et rotation de message
        if (elapsedSeconds % jumpInterval === 0) {
            jumpTextPosition();
        }

        updateVisualPhase();
        updateHud();

        if (remainingSeconds <= 0) {
            handleFinish();
        }
    }

    // 10. Initialisation
    jumpTextPosition();
    updateVisualPhase();

    if (forceHud) {
        hudEl.classList.add('visible');
    }

    // Démarrage du timer
    const intervalMs = Math.round(1000 / speedMultiplier);
    const mainTimer = setInterval(tick, intervalMs);

    // 11. Raccourcis clavier pour le banc de test
    window.addEventListener('keydown', (e) => {
        document.body.classList.add('interactive');

        switch (e.key.toLowerCase()) {
            case ' ':
                // Pause / Reprise
                isPaused = !isPaused;
                updateHud();
                e.preventDefault();
                break;
            case 'b':
                // Forcer la phase barres
                currentPhase = 'bars';
                stage.className = 'mode-bars';
                stage.style.backgroundColor = '';
                updateHud();
                break;
            case 's':
                // Forcer la phase aplat
                currentPhase = 'solid';
                stage.className = 'mode-solid';
                stage.style.backgroundColor = colors[0];
                updateHud();
                break;
            case 'n':
                // Message suivant + saut immédiat
                jumpTextPosition();
                break;
            case 'f':
                // Plein écran
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
                break;
            case 'h':
                // Basculer l'affichage du HUD
                hudEl.classList.toggle('visible');
                break;
            case 'r':
                // Redémarrer le test
                remainingSeconds = totalDuration;
                elapsedSeconds = 0;
                isFinished = false;
                isPaused = false;
                textOverlay.style.opacity = '1';
                jumpTextPosition();
                updateVisualPhase();
                updateHud();
                break;
            case 'arrowright':
            case '+':
                // Avancer de 30 secondes
                elapsedSeconds += 30;
                remainingSeconds = Math.max(0, remainingSeconds - 30);
                jumpTextPosition();
                updateVisualPhase();
                updateHud();
                if (remainingSeconds <= 0) handleFinish();
                break;
        }
    });

    // Masquage automatique du curseur après inactivité de la souris
    let cursorTimer = null;
    window.addEventListener('mousemove', () => {
        document.body.classList.add('interactive');
        clearTimeout(cursorTimer);
        cursorTimer = setTimeout(() => {
            if (!hudEl.classList.contains('visible')) {
                document.body.classList.remove('interactive');
            }
        }, 2000);
    });

})();
