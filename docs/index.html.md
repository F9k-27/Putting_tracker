# index.html — Auto-Generated Documentation

> Generated on 2026-03-30 09:16:21

## Summary

| Metric | Count |
|---|---|
| Total lines | 259 |
| Element IDs | 40 |
| CSS classes used | 40 |
| Modals | 4 |
| Buttons | 18 |
| Inputs | 5 |
| Asset references | 6 |

## Element IDs

| ID | Tag | Line |
|---|---|---|
| `welcome-modal` | `<div>` | 24 |
| `btn-close-modal` | `<button>` | 38 |
| `game-setup-modal` | `<div>` | 49 |
| `game-min-dist` | `<input>` | 57 |
| `game-max-dist` | `<input>` | 62 |
| `game-reps` | `<input>` | 67 |
| `btn-cancel-game` | `<button>` | 72 |
| `btn-start-game` | `<button>` | 73 |
| `game-over-modal` | `<div>` | 84 |
| `game-results-summary` | `<div>` | 88 |
| `btn-close-game-over` | `<button>` | 90 |
| `btn-open-game-setup` | `<button>` | 102 |
| `btn-unit-toggle` | `<button>` | 104 |
| `success-percent` | `<div>` | 110 |
| `reps-total` | `<div>` | 111 |
| `image-container` | `<div>` | 118 |
| `distance-text` | `<span>` | 127 |
| `distance-unit` | `<span>` | 127 |
| `distance-slider` | `<input>` | 135 |
| `manual-distance-controls` | `<div>` | 142 |
| `btn-left` | `<button>` | 143 |
| `btn-reset` | `<button>` | 144 |
| `btn-right` | `<button>` | 145 |
| `game-active-banner` | `<div>` | 151 |
| `game-progress` | `<span>` | 154 |
| `btn-quit-game` | `<button>` | 155 |
| `btn-game-miss` | `<button>` | 159 |
| `btn-game-sink` | `<button>` | 161 |
| `normal-tracking-section` | `<div>` | 173 |
| `bag-bar` | `<div>` | 179 |
| `missed-minus` | `<button>` | 197 |
| `missed-display` | `<span>` | 198 |
| `missed-plus` | `<button>` | 199 |
| `btn-ok` | `<button>` | 205 |
| `game-tracking-section` | `<div>` | 210 |
| `btn-game-miss` | `<button>` | 211 |
| `btn-game-sink` | `<button>` | 212 |
| `stats-summary-container` | `<div>` | 221 |
| `btn-download` | `<button>` | 230 |
| `upload-json` | `<input>` | 232 |

## Asset References

| Path | Line |
|---|---|
| `style.css` | 8 |
| `images/Icon.ico` | 14 |
| `images/basket.png` | 119 |
| `images/player.png` | 120 |
| `images/qrcode.png` | 250 |
| `script.js` | 256 |

## HTML Comments (Section Markers)

- **Line 5:** Mobile-first viewport: disable pinch-zoom, support notched devices (viewport-fit=cover)
- **Line 10:** Enable "Add to Home Screen" full-screen mode on Android and iOS
- **Line 18:** ============================================================ WELCOME MODAL Shown on first page load. Explains how to use...
- **Line 42:** ============================================================ GAME SETUP MODAL Hidden by default (d-none). Opened when th...
- **Line 54:** Min distance input — value and unit label set by JS based on current unit
- **Line 59:** Max distance input
- **Line 64:** Total throws per game session
- **Line 70:** Cancel returns to normal mode; Start begins the game
- **Line 78:** ============================================================ GAME OVER MODAL Hidden by default (d-none). Shown after all...
- **Line 87:** JS populates this with score and success rate
- **Line 94:** ============================================================ MAIN APPLICATION CONTAINER Max-width 480px, centered. Full-...
- **Line 101:** Top-left: opens game setup modal
- **Line 103:** Top-right: toggles between meters and feet display
- **Line 106:** ── Stats Header ── Shows success % and reps count for the CURRENT distance. Updated dynamically by updateUI() in script....
- **Line 114:** ── Visual Distance Representation ── Two images (basket + player) with a CSS gap that grows as distance increases (max v...
- **Line 123:** ── Distance Display ── Large text showing current distance + unit (e.g., "10m" or "33ft"). Both spans updated by updateU...
- **Line 130:** ── Distance Slider ── Range input for distances 1-20m. Distances 21-35m are only reachable via the arrow buttons below. ...
- **Line 138:** ── Manual Distance Controls ── Left/Right arrows for fine-tuning distance (full range 1-35). Reset returns to distance 6...
- **Line 148:** ── Game Active Banner ── Visible only during an active game session (d-none toggled by JS). Shows current throw progress...
- **Line 153:** e.g., "Throw 3 / 10" — updated each round by nextGameThrow()
- **Line 158:** Miss: records a missed throw for this distance
- **Line 160:** Sink: records a successful throw for this distance
- **Line 167:** ============================================================ NORMAL TRACKING SECTION Visible in normal (non-game) mode. ...
- **Line 175:** Disc count selector: 1-10 buttons. Default active = 5. Clicking a button sets currentBag and highlights it.
- **Line 193:** Missed counter: +/- buttons with display. Capped at currentBag.
- **Line 203:** OK button: saves currentBag and currentMissed to statsData for the current distance, increments reps, resets missed to 0
- **Line 208:** Duplicate game tracking section (unused in current flow — game actions are inside game-active-banner instead)
- **Line 217:** ── Stats Summary ── Populated by renderStatsSummary() in script.js. Displays horizontal bar charts for each logged dista...
- **Line 225:** ── Data Import/Export ── Download: exports statsData as a dated JSON file. Upload: hidden file input triggered by the st...
- **Line 235:** ── About Section ── Project info, feedback links (GitHub Issues + Google Form), and PayPal donation QR code.
- **Line 255:** Main application logic — loaded after DOM is ready

## CSS Classes Used

`about-section`, `active`, `bolt-percent`, `btn-game`, `btn-primary`, `btn-quit`, `btn-secondary`, `container`, `controls`, `counter-btn`, `counter-group`, `data-section`, `distance-display`, `divider`, `game-actions`, `game-actions-inline`, `game-banner`, `game-banner-top`, `game-miss`, `game-sink`, `game-toggle-btn`, `game-unit-label`, `icon-btn`, `images-wrapper`, `input-group-col`, `input-style`, `modal-content`, `modal-instructions`, `modal-overlay`, `num-btn`, `number-bar`, `reps-count`, `slider-container`, `stats-header`, `stats-summary`, `support-box`, `support-qr`, `tracking-section`, `unit-toggle`, `upload-label`
