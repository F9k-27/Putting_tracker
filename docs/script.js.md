# script.js — Auto-Generated Documentation

> Generated on 2026-03-30 09:16:21

## Summary

| Metric | Count |
|---|---|
| Total lines | 562 |
| Functions | 6 |
| Variables (top-level) | 33 |
| Event listeners | 19 |
| Section comments | 16 |

## Sections

- **Line 1:** PUTTING TRACKER — APPLICATION LOGIC
- **Line 15:** DATA STORAGE
- **Line 28:** DOM ELEMENT REFERENCES
- **Line 66:** STATE VARIABLES
- **Line 85:** WELCOME MODAL
- **Line 94:** UNIT TOGGLE
- **Line 106:** CORE UI UPDATE FUNCTION
- **Line 158:** STATS SUMMARY BAR CHART
- **Line 215:** DISC COUNT SELECTION (Normal Mode)
- **Line 242:** MISSED COUNTER (Normal Mode)
- **Line 263:** GAME MODE — SETUP & FLOW
- **Line 448:** OK BUTTON — NORMAL MODE SAVE
- **Line 477:** MANUAL DISTANCE CONTROLS (Normal Mode)
- **Line 506:** JSON DATA EXPORT (Download)
- **Line 529:** JSON DATA IMPORT (Upload)
- **Line 557:** INITIALIZATION

## Functions

| Function | Parameters | Line | Description |
|---|---|---|---|
| `updateUI` | `distance` | 117 |  |
| `renderStatsSummary` | `_none_` | 165 |  |
| `nextGameThrow` | `_none_` | 345 | Picks a random distance between gameMin and gameMax (inclusive), updates the UI, and displays the throw counter. |
| `recordGameThrow` | `isSink` | 361 | Records a single throw during game mode. Key design choice: reps is NOT incremented during game mode. This keeps the reps counter as a "focused practi |
| `endGame` | `quitEarly = false` | 403 | Ends the current game session and restores normal mode UI. If the game completed normally (not quit early), shows the results modal with score and suc |
| `setManualControlsState` | `disabled` | 435 | Toggles the enabled/disabled state of manual distance controls. Used to lock controls during game mode so the user can't change distance. |

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
| `let` | `currentDistance` | 71 | Active distance in meters (range: 1-35) |
| `let` | `currentBag` | 72 | Number of discs selected (range: 1-10) |
| `let` | `currentMissed` | 73 | Missed throws in current session (reset after OK) |
| `let` | `isMeters` | 74 | Display unit: true = meters, false = feet |
| `let` | `isGameMode` | 77 | Whether game mode is currently active |
| `let` | `gameMin` | 78 | Minimum random distance (meters) |
| `let` | `gameMax` | 79 | Maximum random distance (meters) |
| `let` | `gameTotalThrows` | 80 | Total throws configured for this game session |
| `let` | `gameCurrentThrow` | 81 | Current throw number (1-indexed) |
| `let` | `gameSessionStats` | 82 | Game session accumulator |

## Event Listeners

| Target | Event | Line |
|---|---|---|
| `btnCloseModal` | `click` | 89 |
| `btnUnitToggle` | `click` | 99 |
| `btn` | `click` | 225 |
| `btnMissedMinus` | `click` | 248 |
| `btnMissedPlus` | `click` | 255 |
| `btnOpenGameSetup` | `click` | 275 |
| `btn-cancel-game` | `click` | 292 |
| `btn-start-game` | `click` | 301 |
| `btn-quit-game` | `click` | 336 |
| `btn-close-game-over` | `click` | 339 |
| `btn-game-sink` | `click` | 393 |
| `btn-game-miss` | `click` | 394 |
| `btnOk` | `click` | 457 |
| `btn-left` | `click` | 488 |
| `btn-right` | `click` | 492 |
| `btn-reset` | `click` | 496 |
| `distanceSlider` | `input` | 500 |
| `btn-download` | `click` | 513 |
| `upload-json` | `change` | 536 |
