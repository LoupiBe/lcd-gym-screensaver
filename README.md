# LCD Gym Screensaver 🏋️

Écran de veille autonome et ultra-léger conçu pour **dépolariser les cristaux liquides** et **prévenir le marquage ("burn-in") des dalles LCD** (spécifiquement optimisé pour écrans industriels et moniteurs LCD 19" en affichage statique 24/7).

Totalement indépendant de toute pile applicative (zéro dépendance Node.js/npm, pur HTML5 / CSS3 / Vanilla JS).

---

## 🎯 Fonctionnalités Physiques & Optiques

1. **Cycle de dépolarisation de 10 minutes** :
   - **30 secondes de balayage de barres contrastées** : Déplacement continu haute fréquence de barres larges (`#FFFFFF`, `#000000`, `#FF0000`, `#00FF00`, `#0000FF`).
   - **30 secondes d'aplats de couleurs successifs** : Flashs complets de chaque sous-pixel pendant 5 secondes par couleur.
2. **Couleurs 100 % inversées (`mix-blend-mode: difference`)** :
   - Le texte reste parfaitement lisible sur n'importe quel arrière-plan sans masque ni bordure sombre.
   - Noir sur blanc, blanc sur noir, cyan sur rouge, magenta sur vert, jaune sur bleu.
3. **Anti-marquage du texte (Sauts aléatoires toutes les 10 secondes)** :
   - Le bloc de texte change de position à intervalle régulier pour ne jamais fatiguer les mêmes pixels.
   - Rotation automatique des 4 messages clins d'œil (avec accents français, sans émojis) :
     1. *"Je fais ma gym après un bon café"*
     2. *"Étirement des pixels en cours, tout va bien"*
     3. *"Séance de fitness quotidienne de l'écran"*
     4. *"L'écran fait son jogging"*
4. **Compte à rebours dynamique** :
   - Affiche *"Maintenance préventive de l'écran — Mise en veille dans X min"*.
   - Passage en écran noir pur à l'issue des 10 minutes avant coupure matérielle du signal HDMI.

---

## 🚀 Tester Localement sur votre Machine

Un script de test local interactif est fourni :

```bash
cd /home/loupi/Documents/Dev/lcd-gym-screensaver
./test-local.sh
```

### Modes de lancement disponibles :

```bash
# 1. Mode Démo (Recommandé pour tester rapidement : 60 secondes à vitesse x5)
./test-local.sh --demo

# 2. Mode Réel (10 minutes avec HUD de contrôle)
./test-local.sh --normal

# 3. Mode Kiosk (Plein écran sans bordure ni curseur)
./test-local.sh --kiosk
```

### Raccourcis clavier pendant le test :

| Touche | Action |
| :---: | :--- |
| **`[Espace]`** | Mettre en pause / Reprendre le défilement du temps |
| **`[B]`** | Forcer immédiatement la phase **Barres RVB/N&B** |
| **`[S]`** | Forcer immédiatement la phase **Aplats de couleurs** |
| **`[N]`** | Passer au **prochain message** et déclencher un saut de position |
| **`[->]`** | **Avancer de 30 secondes** dans le compte à rebours |
| **`[F]`** | Basculer en **Plein Écran** |
| **`[H]`** | Afficher / Masquer le **HUD de contrôle** |
| **`[R]`** | **Recommencer** le cycle depuis le début |

---

## ⚙️ Paramétrage via l'URL

Vous pouvez surcharger n'importe quel paramètre directement dans l'URL sans toucher au code :

* `?duration=60` : durée totale en secondes (ex: 60s au lieu de 600s).
* `?speed=5` : accélérateur de temps (5x plus rapide).
* `?phase=15` : alterner barres/aplats toutes les 15s au lieu de 30s.
* `?jump=5` : sauter de position toutes les 5s au lieu de 10s.
* `?hud=1` : afficher le panneau d'information en bas à droite.
* `?autoexit=1` : tenter de fermer la fenêtre à la fin du cycle.

Exemple : `file:///path/to/index.html?duration=30&speed=3&hud=1`

---

## 🖥️ Intégration Système (Raspberry Pi / Kiosk / Cage)

Le script `launch-kiosk.sh` et le service `systemd/lcd-gym.service` permettent d'orchestrer le lancement au niveau système :

1. À l'heure de fermeture de la gare :
   ```bash
   sudo systemctl stop kiosk-display
   sudo systemctl start lcd-gym.service
   ```
2. `lcd-gym.service` lance l'écran de veille pendant 10 minutes.
3. À la fin des 10 minutes, `ExecStopPost` coupe automatiquement le signal HDMI :
   ```bash
   echo "off" > /sys/class/drm/card*-HDMI-A-*/status
   ```
4. Au matin, à l'heure d'ouverture :
   ```bash
   echo "on" > /sys/class/drm/card*-HDMI-A-*/status
   sudo systemctl start kiosk-display
   ```
