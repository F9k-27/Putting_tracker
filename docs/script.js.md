# script.js — Auto-Generated Documentation

> Generated on 2026-09-01 19:32:46

## Summary

| Metric | Count |
|---|---|
| Total lines | 782 |
| Functions | 11 |
| Variables (top-level) | 44 |
| Event listeners | 23 |
| Section comments | 18 |

## Sections

- **Line 1:** PUTTING TRACKER — APPLICATION LOGIC
- **Line 15:** DATA STORAGE
- **Line 28:** DOM ELEMENT REFERENCES
- **Line 87:** STATE VARIABLES
- **Line 108:** WELCOME MODAL
- **Line 117:** UNIT TOGGLE
- **Line 129:** CORE UI UPDATE FUNCTION
- **Line 184:** STANCE SELECTOR
- **Line 234:** STATS SUMMARY BAR CHART
- **Line 291:** DISC COUNT SELECTION (Normal Mode)
- **Line 318:** MISSED COUNTER (Normal Mode)
- **Line 339:** GAME MODE — SETUP & FLOW
- **Line 537:** OK BUTTON — NORMAL MODE SAVE
- **Line 566:** MANUAL DISTANCE CONTROLS (Normal Mode)
- **Line 595:** PRACTICE SUMMARY
- **Line 726:** JSON DATA EXPORT (Download)
- **Line 749:** JSON DATA IMPORT (Upload)
- **Line 777:** INITIALIZATION

## Functions

| Function | Parameters | Line | Description |
|---|---|---|---|
| `updateUI` | `distance` | 140 |  |
| `updateStanceOptions` | `_none_` | 195 |  |
| `stanceLabel` | `value` | 222 | Returns the human-readable label for a stance value. */ |
| `pickRandomStance` | `distance` | 228 | Picks a random stance valid for the given distance (respects the >10 m rule). */ |
| `renderStatsSummary` | `_none_` | 241 |  |
| `nextGameThrow` | `_none_` | 425 | Picks a random distance between gameMin and gameMax (inclusive), updates the UI, and displays the throw counter. |
| `recordGameThrow` | `isSink` | 449 | Records a single throw during game mode. Key design choice: reps is NOT incremented during game mode. This keeps the reps counter as a "focused practi |
| `endGame` | `quitEarly = false` | 491 | Ends the current game session and restores normal mode UI. If the game completed normally (not quit early), shows the results modal with score and suc |
| `setManualControlsState` | `disabled` | 524 | Toggles the enabled/disabled state of manual distance controls. Used to lock controls during game mode so the user can't change distance. |
| `formatDistance` | `distMeters` | 616 | Formats a meters value into the currently active display unit. */ |
| `renderPracticeSummary` | `_none_` | 624 | Builds the practice summary DOM and injects it into the modal. Called each time the modal opens so the numbers are always current. |

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
| `const` | `practiceSummaryModal` | 612 |  |
| `const` | `practiceSummaryContent` | 613 |  |

## Event Listeners

| Target | Event | Line |
|---|---|---|
| `btnCloseModal` | `click` | 112 |
| `btnUnitToggle` | `click` | 122 |
| `stanceSelect` | `change` | 210 |
| `btnToggleStance` | `click` | 215 |
| `btn` | `click` | 301 |
| `btnMissedMinus` | `click` | 324 |
| `btnMissedPlus` | `click` | 331 |
| `btnOpenGameSetup` | `click` | 351 |
| `btn-cancel-game` | `click` | 368 |
| `btn-start-game` | `click` | 377 |
| `btn-quit-game` | `click` | 416 |
| `btn-close-game-over` | `click` | 419 |
| `btn-game-sink` | `click` | 481 |
| `btn-game-miss` | `click` | 482 |
| `btnOk` | `click` | 546 |
| `btn-left` | `click` | 577 |
| `btn-right` | `click` | 581 |
| `btn-reset` | `click` | 585 |
| `distanceSlider` | `input` | 589 |
| `btn-end-practice` | `click` | 715 |
| `btn-close-practice-summary` | `click` | 721 |
| `btn-download` | `click` | 733 |
| `upload-json` | `change` | 756 |
