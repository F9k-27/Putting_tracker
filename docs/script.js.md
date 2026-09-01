# script.js — Auto-Generated Documentation

> Generated on 2026-09-01 20:16:10

## Summary

| Metric | Count |
|---|---|
| Total lines | 1129 |
| Functions | 24 |
| Variables (top-level) | 58 |
| Event listeners | 28 |
| Section comments | 20 |

## Sections

- **Line 1:** PUTTING TRACKER — APPLICATION LOGIC
- **Line 15:** DATA STORAGE
- **Line 28:** DOM ELEMENT REFERENCES
- **Line 87:** STATE VARIABLES
- **Line 108:** WELCOME MODAL
- **Line 117:** UNIT TOGGLE
- **Line 129:** CORE UI UPDATE FUNCTION
- **Line 184:** STANCE SELECTOR
- **Line 234:** AIM / TARGET TRACKER  (crosshair toggle)
- **Line 353:** HEATMAP RENDERING
- **Line 564:** STATS SUMMARY BAR CHART
- **Line 621:** DISC COUNT SELECTION (Normal Mode)
- **Line 648:** MISSED COUNTER (Normal Mode)
- **Line 669:** GAME MODE — SETUP & FLOW
- **Line 872:** OK BUTTON — NORMAL MODE SAVE
- **Line 904:** MANUAL DISTANCE CONTROLS (Normal Mode)
- **Line 933:** PRACTICE SUMMARY
- **Line 1073:** JSON DATA EXPORT (Download)
- **Line 1096:** JSON DATA IMPORT (Upload)
- **Line 1124:** INITIALIZATION

## Functions

| Function | Parameters | Line | Description |
|---|---|---|---|
| `updateUI` | `distance` | 140 |  |
| `updateStanceOptions` | `_none_` | 195 |  |
| `stanceLabel` | `value` | 222 | Returns the human-readable label for a stance value. */ |
| `pickRandomStance` | `distance` | 228 | Picks a random stance valid for the given distance (respects the >10 m rule). */ |
| `setTargetMode` | `on` | 275 | Arms or disarms crosshair mode. This no longer changes the main screen — the basket/player visual and distance controls stay put. When armed, the land |
| `updateTargetProgress` | `_none_` | 288 | Updates the "Marks: n / bag" progress readout in the popup. */ |
| `renderMarkers` | `_none_` | 293 | Rebuilds the marker dots from the current in-progress set. */ |
| `openLandingModal` | `_none_` | 308 | Opens the landing-input popup for the current distance/bag. Called from the OK handler when crosshair mode is armed. |
| `commitLanding` | `_none_` | 322 | Stores whatever marks were placed into targetData for the captured distance, then closes the popup. Safe to call with zero marks. |
| `heatColor` | `t` | 362 | Maps intensity t (0..1) to a blue→cyan→green→yellow→red heat color. */ |
| `drawHeatmap` | `canvas, points, radiusFactor = 0.14` | 386 | Draws a density heatmap of normalized points onto the given canvas. */ |
| `makeHeatmapWrap` | `densityPoints, labelPoints` | 422 | Builds a basket image with an overlaid heatmap canvas and optional labels. */ |
| `centroid` | `points` | 452 | Mean (centroid) of a set of normalized points. */ |
| `dispersion` | `points, c` | 459 | Mean distance of points from a center — a grouping-spread measure. */ |
| `distancesWithMarks` | `_none_` | 467 | Returns sorted list of distances that have landing marks. */ |
| `renderSummaryHeatmap` | `_none_` | 479 | Appends the aggregate "landing heatmap" (all marks) with per-distance average-position labels, plus a button to open the per-distance modal. Called at |
| `renderDistanceHeatmaps` | `_none_` | 515 | Renders one heatmap + grouping stats block per practiced distance. */ |
| `renderStatsSummary` | `_none_` | 571 |  |
| `nextGameThrow` | `_none_` | 759 | Picks a random distance between gameMin and gameMax (inclusive), updates the UI, and displays the throw counter. |
| `recordGameThrow` | `isSink` | 783 | Records a single throw during game mode. Key design choice: reps is NOT incremented during game mode. This keeps the reps counter as a "focused practi |
| `endGame` | `quitEarly = false` | 825 | Ends the current game session and restores normal mode UI. If the game completed normally (not quit early), shows the results modal with score and suc |
| `setManualControlsState` | `disabled` | 859 | Toggles the enabled/disabled state of manual distance controls. Used to lock controls during game mode so the user can't change distance. |
| `formatDistance` | `distMeters` | 954 | Formats a meters value into the currently active display unit. */ |
| `renderPracticeSummary` | `_none_` | 962 | Builds the practice summary DOM and injects it into the modal. Called each time the modal opens so the numbers are always current. |

## Top-Level Variables

| Kind | Name | Line | Comment |
|---|---|---|---|
| `let` | `statsData` | 25 |  |
| `const` | `distanceText` | 34 | Distance number (e.g., "10") |
| `const` | `distanceUnit` | 35 | Unit label ("m" or "ft") |
| `const` | `distanceSlider` | 36 | Range input (1-20) |
| `const` | `imageContainer` | 37 | Basket + player image wrapper |
| `const` | `successDisplay` | 40 | Success % for current distance |
| `const` | `repsDisplay` | 41 | Reps count for current distance |
| `const` | `missedDisplay` | 42 | Current missed counter value |
| `const` | `statsSummaryContainer` | 43 | Bar chart container |
| `const` | `welcomeModal` | 46 | Welcome overlay |
| `const` | `btnCloseModal` | 47 | Close welcome button |
| `const` | `btnUnitToggle` | 48 | Meters/Feet toggle |
| `const` | `btnOpenGameSetup` | 49 | Game setup opener |
| `const` | `normalTrackingSection` | 52 | Normal mode UI |
| `const` | `manualControls` | 53 | Arrow/reset row |
| `const` | `numBtns` | 54 | Disc count buttons (1-10) |
| `const` | `btnMissedMinus` | 55 | Decrease missed button |
| `const` | `btnMissedPlus` | 56 | Increase missed button |
| `const` | `btnOk` | 57 | Save stats button |
| `const` | `gameSetupModal` | 60 | Game config overlay |
| `const` | `gameOverModal` | 61 | Game results overlay |
| `const` | `gameActiveBanner` | 62 | In-game progress banner |
| `const` | `gameProgressText` | 63 | "Throw X / Y" text |
| `const` | `stanceSelect` | 66 | Stance dropdown |
| `const` | `stanceJumpOption` | 67 | "Jump Putt" option (distance-gated) |
| `const` | `btnToggleStance` | 68 | Show/hide the stance selector |
| `const` | `stanceSelector` | 69 | Stance selector wrapper (hidden by default) |
| `const` | `gameStanceDisplay` | 70 | Stance line in the game banner |
| `const` | `gameStanceName` | 71 | Random stance name shown during a game |
| `const` | `STANCES` | 76 |  |
| `let` | `currentDistance` | 92 | Active distance in meters (range: 1-35) |
| `let` | `currentBag` | 93 | Number of discs selected (range: 1-10) |
| `let` | `currentMissed` | 94 | Missed throws in current session (reset after OK) |
| `let` | `isMeters` | 95 | Display unit: true = meters, false = feet |
| `let` | `currentStance` | 96 | Selected putting stance (label only for now — not yet tracked in stats) |
| `let` | `isGameMode` | 99 | Whether game mode is currently active |
| `let` | `gameMin` | 100 | Minimum random distance (meters) |
| `let` | `gameMax` | 101 | Maximum random distance (meters) |
| `let` | `gameTotalThrows` | 102 | Total throws configured for this game session |
| `let` | `gameCurrentThrow` | 103 | Current throw number (1-indexed) |
| `let` | `gameSessionStats` | 104 | Game session accumulator |
| `let` | `randomizeStanceInGame` | 105 | Whether the game picks a random stance each throw |
| `const` | `btnToggleTarget` | 251 | Crosshair toggle |
| `const` | `landingModal` | 252 | Landing-input popup |
| `const` | `landingDistanceLabel` | 253 | Distance shown in popup |
| `const` | `btnLandingDone` | 254 | Finish/close popup |
| `const` | `targetBasket` | 255 | Clickable basket wrapper |
| `const` | `targetMarkers` | 256 | Marker dots overlay |
| `const` | `targetProgress` | 257 | "Marks: n / bag" line |
| `const` | `heatmapModal` | 260 |  |
| `const` | `heatmapModalContent` | 261 |  |
| `let` | `isTargetMode` | 264 | Whether crosshair mode is armed (records landings after OK) |
| `let` | `targetData` | 265 | Session-only landing positions, keyed by distance |
| `let` | `currentSet` | 266 | Marks placed in the currently-open landing popup |
| `let` | `landingDistance` | 267 | Distance captured when the popup opened |
| `let` | `landingBag` | 268 | Number of marks expected (bag size at OK time) |
| `const` | `practiceSummaryModal` | 950 |  |
| `const` | `practiceSummaryContent` | 951 |  |

## Event Listeners

| Target | Event | Line |
|---|---|---|
| `btnCloseModal` | `click` | 112 |
| `btnUnitToggle` | `click` | 122 |
| `stanceSelect` | `change` | 210 |
| `btnToggleStance` | `click` | 215 |
| `btnToggleTarget` | `click` | 282 |
| `targetBasket` | `click` | 333 |
| `btnLandingDone` | `click` | 350 |
| `btn` | `click` | 507 |
| `btn-close-heatmap` | `click` | 559 |
| `btn` | `click` | 631 |
| `btnMissedMinus` | `click` | 654 |
| `btnMissedPlus` | `click` | 661 |
| `btnOpenGameSetup` | `click` | 681 |
| `btn-cancel-game` | `click` | 698 |
| `btn-start-game` | `click` | 707 |
| `btn-quit-game` | `click` | 750 |
| `btn-close-game-over` | `click` | 753 |
| `btn-game-sink` | `click` | 815 |
| `btn-game-miss` | `click` | 816 |
| `btnOk` | `click` | 881 |
| `btn-left` | `click` | 915 |
| `btn-right` | `click` | 919 |
| `btn-reset` | `click` | 923 |
| `distanceSlider` | `input` | 927 |
| `btn-end-practice` | `click` | 1062 |
| `btn-close-practice-summary` | `click` | 1068 |
| `btn-download` | `click` | 1080 |
| `upload-json` | `change` | 1103 |
