# index.html — Auto-Generated Documentation

> Generated on 2026-09-01 20:10:12

## Summary

| Metric | Count |
|---|---|
| Total lines | 361 |
| Element IDs | 63 |
| CSS classes used | 49 |
| Modals | 8 |
| Buttons | 24 |
| Inputs | 6 |
| Asset references | 7 |

## Element IDs

| ID | Tag | Line |
|---|---|---|
| `welcome-modal` | `<div>` | 24 |
| `btn-close-modal` | `<button>` | 41 |
| `game-setup-modal` | `<div>` | 52 |
| `game-min-dist` | `<input>` | 60 |
| `game-max-dist` | `<input>` | 65 |
| `game-reps` | `<input>` | 70 |
| `game-random-stance` | `<input>` | 76 |
| `btn-cancel-game` | `<button>` | 82 |
| `btn-start-game` | `<button>` | 83 |
| `game-over-modal` | `<div>` | 94 |
| `game-results-summary` | `<div>` | 98 |
| `btn-close-game-over` | `<button>` | 100 |
| `practice-summary-modal` | `<div>` | 111 |
| `practice-summary-content` | `<div>` | 115 |
| `btn-close-practice-summary` | `<button>` | 116 |
| `landing-modal` | `<div>` | 129 |
| `landing-distance` | `<p>` | 132 |
| `target-basket` | `<div>` | 133 |
| `target-basket-img` | `<img>` | 134 |
| `target-markers` | `<div>` | 137 |
| `target-progress` | `<div>` | 139 |
| `btn-landing-done` | `<button>` | 140 |
| `heatmap-modal` | `<div>` | 151 |
| `heatmap-modal-content` | `<div>` | 154 |
| `btn-close-heatmap` | `<button>` | 155 |
| `btn-open-game-setup` | `<button>` | 167 |
| `btn-toggle-target` | `<button>` | 171 |
| `btn-unit-toggle` | `<button>` | 173 |
| `success-percent` | `<div>` | 179 |
| `reps-total` | `<div>` | 180 |
| `image-container` | `<div>` | 187 |
| `distance-text` | `<span>` | 196 |
| `distance-unit` | `<span>` | 196 |
| `distance-slider` | `<input>` | 204 |
| `manual-distance-controls` | `<div>` | 211 |
| `btn-left` | `<button>` | 212 |
| `btn-reset` | `<button>` | 213 |
| `btn-right` | `<button>` | 214 |
| `game-active-banner` | `<div>` | 220 |
| `game-progress` | `<span>` | 223 |
| `btn-quit-game` | `<button>` | 224 |
| `game-stance-display` | `<div>` | 228 |
| `game-stance-name` | `<div>` | 228 |
| `btn-game-miss` | `<button>` | 231 |
| `btn-game-sink` | `<button>` | 233 |
| `btn-toggle-stance` | `<button>` | 246 |
| `stance-selector` | `<div>` | 248 |
| `stance-select` | `<select>` | 250 |
| `stance-jump-option` | `<option>` | 257 |
| `normal-tracking-section` | `<div>` | 269 |
| `bag-bar` | `<div>` | 275 |
| `missed-group` | `<div>` | 291 |
| `missed-minus` | `<button>` | 294 |
| `missed-display` | `<span>` | 295 |
| `missed-plus` | `<button>` | 296 |
| `btn-ok` | `<button>` | 302 |
| `game-tracking-section` | `<div>` | 307 |
| `btn-game-miss` | `<button>` | 308 |
| `btn-game-sink` | `<button>` | 309 |
| `stats-summary-container` | `<div>` | 318 |
| `btn-end-practice` | `<button>` | 325 |
| `btn-download` | `<button>` | 332 |
| `upload-json` | `<input>` | 334 |

## Asset References

| Path | Line |
|---|---|
| `style.css` | 8 |
| `images/Icon.ico` | 14 |
| `images/Basketbig.png` | 134 |
| `images/basket.png` | 188 |
| `images/player.png` | 189 |
| `images/qrcode.png` | 352 |
| `script.js` | 358 |

## HTML Comments (Section Markers)

- **Line 5:** Mobile-first viewport: disable pinch-zoom, support notched devices (viewport-fit=cover)
- **Line 10:** Enable "Add to Home Screen" full-screen mode on Android and iOS
- **Line 18:** ============================================================ WELCOME MODAL Shown on first page load. Explains how to use...
- **Line 45:** ============================================================ GAME SETUP MODAL Hidden by default (d-none). Opened when th...
- **Line 57:** Min distance input — value and unit label set by JS based on current unit
- **Line 62:** Max distance input
- **Line 67:** Total throws per game session
- **Line 73:** When checked, a random stance is suggested each throw (respecting the >10 m rule for Jump Putt). Read at game start.
- **Line 80:** Cancel returns to normal mode; Start begins the game
- **Line 88:** ============================================================ GAME OVER MODAL Hidden by default (d-none). Shown after all...
- **Line 97:** JS populates this with score and success rate
- **Line 104:** ============================================================ PRACTICE SUMMARY MODAL Hidden by default (d-none). Opened b...
- **Line 114:** JS populates this with stat cards + highlights
- **Line 120:** ============================================================ LANDING INPUT MODAL Hidden by default (d-none). Opened afte...
- **Line 136:** Markers (dots) are appended here by JS
- **Line 144:** ============================================================ PER-DISTANCE HEATMAP MODAL Hidden by default (d-none). Open...
- **Line 159:** ============================================================ MAIN APPLICATION CONTAINER Max-width 480px, centered. Full-...
- **Line 166:** Top-left: opens game setup modal
- **Line 168:** Next to game button: checkable crosshair (aim-tracking) toggle. White by default, blue when active. Toggles target mode ...
- **Line 172:** Top-right: toggles between meters and feet display
- **Line 175:** ── Stats Header ── Shows success % and reps count for the CURRENT distance. Updated dynamically by updateUI() in script....
- **Line 183:** ── Visual Distance Representation ── Two images (basket + player) with a CSS gap that grows as distance increases (max v...
- **Line 192:** ── Distance Display ── Large text showing current distance + unit (e.g., "10m" or "33ft"). Both spans updated by updateU...
- **Line 199:** ── Distance Slider ── Range input for distances 1-20m. Distances 21-35m are only reachable via the arrow buttons below. ...
- **Line 207:** ── Manual Distance Controls ── Left/Right arrows for fine-tuning distance (full range 1-35). Reset returns to distance 6...
- **Line 217:** ── Game Active Banner ── Visible only during an active game session (d-none toggled by JS). Shows current throw progress...
- **Line 222:** e.g., "Throw 3 / 10" — updated each round by nextGameThrow()
- **Line 226:** Shown only when "randomize stance" is enabled for the game. Populated with a fresh random stance each throw.
- **Line 230:** Miss: records a missed throw for this distance
- **Line 232:** Sink: records a successful throw for this distance
- **Line 237:** ── Stance Selector ── Kept outside the normal/game sections so it stays visible in both modes. Currently a selectable la...
- **Line 263:** ============================================================ NORMAL TRACKING SECTION Visible in normal (non-game) mode. ...
- **Line 271:** Disc count selector: 1-10 buttons. Default active = 5. Clicking a button sets currentBag and highlights it.
- **Line 289:** Missed counter: +/- buttons with display. Capped at currentBag. Hidden in target mode (id used by script.js).
- **Line 300:** OK button: saves currentBag and currentMissed to statsData for the current distance, increments reps, resets missed to 0
- **Line 305:** Duplicate game tracking section (unused in current flow — game actions are inside game-active-banner instead)
- **Line 314:** ── Stats Summary ── Populated by renderStatsSummary() in script.js. Displays horizontal bar charts for each logged dista...
- **Line 322:** ── End Practice ── Opens the Practice Summary modal with an overview of the whole session (total putts, success rate, hi...
- **Line 327:** ── Data Import/Export ── Download: exports statsData as a dated JSON file. Upload: hidden file input triggered by the st...
- **Line 337:** ── About Section ── Project info, feedback links (GitHub Issues + Google Form), and PayPal donation QR code.
- **Line 357:** Main application logic — loaded after DOM is ready

## CSS Classes Used

`about-section`, `active`, `bolt-percent`, `btn-game`, `btn-primary`, `btn-quit`, `btn-secondary`, `checkbox-row`, `container`, `controls`, `counter-btn`, `counter-group`, `data-section`, `distance-display`, `divider`, `game-actions`, `game-actions-inline`, `game-banner`, `game-banner-top`, `game-miss`, `game-sink`, `game-stance`, `game-toggle-btn`, `game-unit-label`, `icon-btn`, `images-wrapper`, `input-group-col`, `input-style`, `landing-sub`, `modal-content`, `modal-instructions`, `modal-overlay`, `num-btn`, `number-bar`, `reps-count`, `slider-container`, `stance-selector`, `stance-toggle-btn`, `stats-header`, `stats-summary`, `support-box`, `support-qr`, `target-basket`, `target-markers`, `target-progress`, `target-toggle-btn`, `tracking-section`, `unit-toggle`, `upload-label`
