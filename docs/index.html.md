# index.html — Auto-Generated Documentation

> Generated on 2026-09-01 19:32:46

## Summary

| Metric | Count |
|---|---|
| Total lines | 314 |
| Element IDs | 51 |
| CSS classes used | 44 |
| Modals | 5 |
| Buttons | 21 |
| Inputs | 6 |
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
| `game-random-stance` | `<input>` | 73 |
| `btn-cancel-game` | `<button>` | 79 |
| `btn-start-game` | `<button>` | 80 |
| `game-over-modal` | `<div>` | 91 |
| `game-results-summary` | `<div>` | 95 |
| `btn-close-game-over` | `<button>` | 97 |
| `practice-summary-modal` | `<div>` | 108 |
| `practice-summary-content` | `<div>` | 112 |
| `btn-close-practice-summary` | `<button>` | 113 |
| `btn-open-game-setup` | `<button>` | 125 |
| `btn-unit-toggle` | `<button>` | 127 |
| `success-percent` | `<div>` | 133 |
| `reps-total` | `<div>` | 134 |
| `image-container` | `<div>` | 141 |
| `distance-text` | `<span>` | 150 |
| `distance-unit` | `<span>` | 150 |
| `distance-slider` | `<input>` | 158 |
| `manual-distance-controls` | `<div>` | 165 |
| `btn-left` | `<button>` | 166 |
| `btn-reset` | `<button>` | 167 |
| `btn-right` | `<button>` | 168 |
| `game-active-banner` | `<div>` | 174 |
| `game-progress` | `<span>` | 177 |
| `btn-quit-game` | `<button>` | 178 |
| `game-stance-display` | `<div>` | 182 |
| `game-stance-name` | `<div>` | 182 |
| `btn-game-miss` | `<button>` | 185 |
| `btn-game-sink` | `<button>` | 187 |
| `btn-toggle-stance` | `<button>` | 200 |
| `stance-selector` | `<div>` | 202 |
| `stance-select` | `<select>` | 204 |
| `stance-jump-option` | `<option>` | 211 |
| `normal-tracking-section` | `<div>` | 223 |
| `bag-bar` | `<div>` | 229 |
| `missed-minus` | `<button>` | 247 |
| `missed-display` | `<span>` | 248 |
| `missed-plus` | `<button>` | 249 |
| `btn-ok` | `<button>` | 255 |
| `game-tracking-section` | `<div>` | 260 |
| `btn-game-miss` | `<button>` | 261 |
| `btn-game-sink` | `<button>` | 262 |
| `stats-summary-container` | `<div>` | 271 |
| `btn-end-practice` | `<button>` | 278 |
| `btn-download` | `<button>` | 285 |
| `upload-json` | `<input>` | 287 |

## Asset References

| Path | Line |
|---|---|
| `style.css` | 8 |
| `images/Icon.ico` | 14 |
| `images/basket.png` | 142 |
| `images/player.png` | 143 |
| `images/qrcode.png` | 305 |
| `script.js` | 311 |

## HTML Comments (Section Markers)

- **Line 5:** Mobile-first viewport: disable pinch-zoom, support notched devices (viewport-fit=cover)
- **Line 10:** Enable "Add to Home Screen" full-screen mode on Android and iOS
- **Line 18:** ============================================================ WELCOME MODAL Shown on first page load. Explains how to use...
- **Line 42:** ============================================================ GAME SETUP MODAL Hidden by default (d-none). Opened when th...
- **Line 54:** Min distance input — value and unit label set by JS based on current unit
- **Line 59:** Max distance input
- **Line 64:** Total throws per game session
- **Line 70:** When checked, a random stance is suggested each throw (respecting the >10 m rule for Jump Putt). Read at game start.
- **Line 77:** Cancel returns to normal mode; Start begins the game
- **Line 85:** ============================================================ GAME OVER MODAL Hidden by default (d-none). Shown after all...
- **Line 94:** JS populates this with score and success rate
- **Line 101:** ============================================================ PRACTICE SUMMARY MODAL Hidden by default (d-none). Opened b...
- **Line 111:** JS populates this with stat cards + highlights
- **Line 117:** ============================================================ MAIN APPLICATION CONTAINER Max-width 480px, centered. Full-...
- **Line 124:** Top-left: opens game setup modal
- **Line 126:** Top-right: toggles between meters and feet display
- **Line 129:** ── Stats Header ── Shows success % and reps count for the CURRENT distance. Updated dynamically by updateUI() in script....
- **Line 137:** ── Visual Distance Representation ── Two images (basket + player) with a CSS gap that grows as distance increases (max v...
- **Line 146:** ── Distance Display ── Large text showing current distance + unit (e.g., "10m" or "33ft"). Both spans updated by updateU...
- **Line 153:** ── Distance Slider ── Range input for distances 1-20m. Distances 21-35m are only reachable via the arrow buttons below. ...
- **Line 161:** ── Manual Distance Controls ── Left/Right arrows for fine-tuning distance (full range 1-35). Reset returns to distance 6...
- **Line 171:** ── Game Active Banner ── Visible only during an active game session (d-none toggled by JS). Shows current throw progress...
- **Line 176:** e.g., "Throw 3 / 10" — updated each round by nextGameThrow()
- **Line 180:** Shown only when "randomize stance" is enabled for the game. Populated with a fresh random stance each throw.
- **Line 184:** Miss: records a missed throw for this distance
- **Line 186:** Sink: records a successful throw for this distance
- **Line 191:** ── Stance Selector ── Kept outside the normal/game sections so it stays visible in both modes. Currently a selectable la...
- **Line 217:** ============================================================ NORMAL TRACKING SECTION Visible in normal (non-game) mode. ...
- **Line 225:** Disc count selector: 1-10 buttons. Default active = 5. Clicking a button sets currentBag and highlights it.
- **Line 243:** Missed counter: +/- buttons with display. Capped at currentBag.
- **Line 253:** OK button: saves currentBag and currentMissed to statsData for the current distance, increments reps, resets missed to 0
- **Line 258:** Duplicate game tracking section (unused in current flow — game actions are inside game-active-banner instead)
- **Line 267:** ── Stats Summary ── Populated by renderStatsSummary() in script.js. Displays horizontal bar charts for each logged dista...
- **Line 275:** ── End Practice ── Opens the Practice Summary modal with an overview of the whole session (total putts, success rate, hi...
- **Line 280:** ── Data Import/Export ── Download: exports statsData as a dated JSON file. Upload: hidden file input triggered by the st...
- **Line 290:** ── About Section ── Project info, feedback links (GitHub Issues + Google Form), and PayPal donation QR code.
- **Line 310:** Main application logic — loaded after DOM is ready

## CSS Classes Used

`about-section`, `active`, `bolt-percent`, `btn-game`, `btn-primary`, `btn-quit`, `btn-secondary`, `checkbox-row`, `container`, `controls`, `counter-btn`, `counter-group`, `data-section`, `distance-display`, `divider`, `game-actions`, `game-actions-inline`, `game-banner`, `game-banner-top`, `game-miss`, `game-sink`, `game-stance`, `game-toggle-btn`, `game-unit-label`, `icon-btn`, `images-wrapper`, `input-group-col`, `input-style`, `modal-content`, `modal-instructions`, `modal-overlay`, `num-btn`, `number-bar`, `reps-count`, `slider-container`, `stance-selector`, `stance-toggle-btn`, `stats-header`, `stats-summary`, `support-box`, `support-qr`, `tracking-section`, `unit-toggle`, `upload-label`
