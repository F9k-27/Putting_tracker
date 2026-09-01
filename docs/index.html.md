# index.html — Auto-Generated Documentation

> Generated on 2026-09-01 20:16:10

## Summary

| Metric | Count |
|---|---|
| Total lines | 358 |
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
| `landing-modal` | `<div>` | 126 |
| `landing-distance` | `<p>` | 129 |
| `target-basket` | `<div>` | 130 |
| `target-basket-img` | `<img>` | 131 |
| `target-markers` | `<div>` | 134 |
| `target-progress` | `<div>` | 136 |
| `btn-landing-done` | `<button>` | 137 |
| `heatmap-modal` | `<div>` | 148 |
| `heatmap-modal-content` | `<div>` | 151 |
| `btn-close-heatmap` | `<button>` | 152 |
| `btn-open-game-setup` | `<button>` | 164 |
| `btn-toggle-target` | `<button>` | 168 |
| `btn-unit-toggle` | `<button>` | 170 |
| `success-percent` | `<div>` | 176 |
| `reps-total` | `<div>` | 177 |
| `image-container` | `<div>` | 184 |
| `distance-text` | `<span>` | 193 |
| `distance-unit` | `<span>` | 193 |
| `distance-slider` | `<input>` | 201 |
| `manual-distance-controls` | `<div>` | 208 |
| `btn-left` | `<button>` | 209 |
| `btn-reset` | `<button>` | 210 |
| `btn-right` | `<button>` | 211 |
| `game-active-banner` | `<div>` | 217 |
| `game-progress` | `<span>` | 220 |
| `btn-quit-game` | `<button>` | 221 |
| `game-stance-display` | `<div>` | 225 |
| `game-stance-name` | `<div>` | 225 |
| `btn-game-miss` | `<button>` | 228 |
| `btn-game-sink` | `<button>` | 230 |
| `btn-toggle-stance` | `<button>` | 243 |
| `stance-selector` | `<div>` | 245 |
| `stance-select` | `<select>` | 247 |
| `stance-jump-option` | `<option>` | 254 |
| `normal-tracking-section` | `<div>` | 266 |
| `bag-bar` | `<div>` | 272 |
| `missed-group` | `<div>` | 288 |
| `missed-minus` | `<button>` | 291 |
| `missed-display` | `<span>` | 292 |
| `missed-plus` | `<button>` | 293 |
| `btn-ok` | `<button>` | 299 |
| `game-tracking-section` | `<div>` | 304 |
| `btn-game-miss` | `<button>` | 305 |
| `btn-game-sink` | `<button>` | 306 |
| `stats-summary-container` | `<div>` | 315 |
| `btn-end-practice` | `<button>` | 322 |
| `btn-download` | `<button>` | 329 |
| `upload-json` | `<input>` | 331 |

## Asset References

| Path | Line |
|---|---|
| `style.css` | 8 |
| `images/Icon.ico` | 14 |
| `images/Basketbig.png` | 131 |
| `images/basket.png` | 185 |
| `images/player.png` | 186 |
| `images/qrcode.png` | 349 |
| `script.js` | 355 |

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
- **Line 117:** ============================================================ LANDING INPUT MODAL Hidden by default (d-none). Opened afte...
- **Line 133:** Markers (dots) are appended here by JS
- **Line 141:** ============================================================ PER-DISTANCE HEATMAP MODAL Hidden by default (d-none). Open...
- **Line 156:** ============================================================ MAIN APPLICATION CONTAINER Max-width 480px, centered. Full-...
- **Line 163:** Top-left: opens game setup modal
- **Line 165:** Next to game button: checkable crosshair (aim-tracking) toggle. White by default, blue when active. Toggles target mode ...
- **Line 169:** Top-right: toggles between meters and feet display
- **Line 172:** ── Stats Header ── Shows success % and reps count for the CURRENT distance. Updated dynamically by updateUI() in script....
- **Line 180:** ── Visual Distance Representation ── Two images (basket + player) with a CSS gap that grows as distance increases (max v...
- **Line 189:** ── Distance Display ── Large text showing current distance + unit (e.g., "10m" or "33ft"). Both spans updated by updateU...
- **Line 196:** ── Distance Slider ── Range input for distances 1-20m. Distances 21-35m are only reachable via the arrow buttons below. ...
- **Line 204:** ── Manual Distance Controls ── Left/Right arrows for fine-tuning distance (full range 1-35). Reset returns to distance 6...
- **Line 214:** ── Game Active Banner ── Visible only during an active game session (d-none toggled by JS). Shows current throw progress...
- **Line 219:** e.g., "Throw 3 / 10" — updated each round by nextGameThrow()
- **Line 223:** Shown only when "randomize stance" is enabled for the game. Populated with a fresh random stance each throw.
- **Line 227:** Miss: records a missed throw for this distance
- **Line 229:** Sink: records a successful throw for this distance
- **Line 234:** ── Stance Selector ── Kept outside the normal/game sections so it stays visible in both modes. Currently a selectable la...
- **Line 260:** ============================================================ NORMAL TRACKING SECTION Visible in normal (non-game) mode. ...
- **Line 268:** Disc count selector: 1-10 buttons. Default active = 5. Clicking a button sets currentBag and highlights it.
- **Line 286:** Missed counter: +/- buttons with display. Capped at currentBag. Hidden in target mode (id used by script.js).
- **Line 297:** OK button: saves currentBag and currentMissed to statsData for the current distance, increments reps, resets missed to 0
- **Line 302:** Duplicate game tracking section (unused in current flow — game actions are inside game-active-banner instead)
- **Line 311:** ── Stats Summary ── Populated by renderStatsSummary() in script.js. Displays horizontal bar charts for each logged dista...
- **Line 319:** ── End Practice ── Opens the Practice Summary modal with an overview of the whole session (total putts, success rate, hi...
- **Line 324:** ── Data Import/Export ── Download: exports statsData as a dated JSON file. Upload: hidden file input triggered by the st...
- **Line 334:** ── About Section ── Project info, feedback links (GitHub Issues + Google Form), and PayPal donation QR code.
- **Line 354:** Main application logic — loaded after DOM is ready

## CSS Classes Used

`about-section`, `active`, `bolt-percent`, `btn-game`, `btn-primary`, `btn-quit`, `btn-secondary`, `checkbox-row`, `container`, `controls`, `counter-btn`, `counter-group`, `data-section`, `distance-display`, `divider`, `game-actions`, `game-actions-inline`, `game-banner`, `game-banner-top`, `game-miss`, `game-sink`, `game-stance`, `game-toggle-btn`, `game-unit-label`, `icon-btn`, `images-wrapper`, `input-group-col`, `input-style`, `landing-sub`, `modal-content`, `modal-instructions`, `modal-overlay`, `num-btn`, `number-bar`, `reps-count`, `slider-container`, `stance-selector`, `stance-toggle-btn`, `stats-header`, `stats-summary`, `support-box`, `support-qr`, `target-basket`, `target-markers`, `target-progress`, `target-toggle-btn`, `tracking-section`, `unit-toggle`, `upload-label`
