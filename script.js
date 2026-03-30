/* ==========================================================================
   PUTTING TRACKER — APPLICATION LOGIC

   Two operational modes:
     1. Normal Mode — user selects distance, disc count, and missed throws,
        then clicks OK to save stats.
     2. Game Mode — random distance per throw, miss/sink buttons, score
        displayed at game end.

   Data is stored in-memory (statsData object) and can be exported/imported
   as JSON files. No external dependencies — pure vanilla JavaScript.
   ========================================================================== */


/* ==========================================================================
   DATA STORAGE

   statsData is keyed by distance in METERS (integer). Each entry tracks:
     - totalBalls: cumulative discs thrown at this distance
     - totalMissed: cumulative missed throws at this distance
     - reps: number of practice sessions (OK clicks) — NOT incremented in game mode

   Example: { 6: { totalBalls: 10, totalMissed: 2, reps: 3 } }
   ========================================================================== */
let statsData = {};


/* ==========================================================================
   DOM ELEMENT REFERENCES
   Cached at load time to avoid repeated DOM lookups.
   ========================================================================== */

// -- Distance display and controls --
const distanceText = document.getElementById('distance-text');       // Distance number (e.g., "10")
const distanceUnit = document.getElementById('distance-unit');       // Unit label ("m" or "ft")
const distanceSlider = document.getElementById('distance-slider');   // Range input (1-20)
const imageContainer = document.getElementById('image-container');   // Basket + player image wrapper

// -- Stats display --
const successDisplay = document.getElementById('success-percent');   // Success % for current distance
const repsDisplay = document.getElementById('reps-total');           // Reps count for current distance
const missedDisplay = document.getElementById('missed-display');     // Current missed counter value
const statsSummaryContainer = document.getElementById('stats-summary-container'); // Bar chart container

// -- Modal and top-bar elements --
const welcomeModal = document.getElementById('welcome-modal');       // Welcome overlay
const btnCloseModal = document.getElementById('btn-close-modal');    // Close welcome button
const btnUnitToggle = document.getElementById('btn-unit-toggle');    // Meters/Feet toggle
const btnOpenGameSetup = document.getElementById('btn-open-game-setup'); // Game setup opener

// -- Normal mode tracking elements --
const normalTrackingSection = document.getElementById('normal-tracking-section'); // Normal mode UI
const manualControls = document.getElementById('manual-distance-controls');       // Arrow/reset row
const numBtns = document.querySelectorAll('.num-btn');               // Disc count buttons (1-10)
const btnMissedMinus = document.getElementById('missed-minus');      // Decrease missed button
const btnMissedPlus = document.getElementById('missed-plus');        // Increase missed button
const btnOk = document.getElementById('btn-ok');                     // Save stats button

// -- Game mode elements --
const gameSetupModal = document.getElementById('game-setup-modal');  // Game config overlay
const gameOverModal = document.getElementById('game-over-modal');    // Game results overlay
const gameActiveBanner = document.getElementById('game-active-banner'); // In-game progress banner
const gameProgressText = document.getElementById('game-progress');   // "Throw X / Y" text


/* ==========================================================================
   STATE VARIABLES
   ========================================================================== */

// -- Normal mode state --
let currentDistance = 6;   // Active distance in meters (range: 1-35)
let currentBag = 5;        // Number of discs selected (range: 1-10)
let currentMissed = 0;     // Missed throws in current session (reset after OK)
let isMeters = true;       // Display unit: true = meters, false = feet

// -- Game mode state --
let isGameMode = false;    // Whether game mode is currently active
let gameMin = 5;           // Minimum random distance (meters)
let gameMax = 10;          // Maximum random distance (meters)
let gameTotalThrows = 10;  // Total throws configured for this game session
let gameCurrentThrow = 1;  // Current throw number (1-indexed)
let gameSessionStats = { totalThrows: 0, totalMissed: 0 }; // Game session accumulator


/* ==========================================================================
   WELCOME MODAL
   Shown on page load. Dismissed by adding 'hidden' class (CSS fades it out).
   ========================================================================== */
btnCloseModal.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
});


/* ==========================================================================
   UNIT TOGGLE
   Switches display between meters and feet. All internal data stays in meters.
   Conversion: 1 meter = 3.28084 feet.
   ========================================================================== */
btnUnitToggle.addEventListener('click', () => {
    isMeters = !isMeters;
    btnUnitToggle.innerText = isMeters ? "Unit: Meters" : "Unit: Feet";
    updateUI(currentDistance);
});


/* ==========================================================================
   CORE UI UPDATE FUNCTION

   Called whenever distance, stats, or unit changes. Responsible for:
   1. Converting distance to display unit (meters or feet)
   2. Updating the distance text and unit label
   3. Syncing the slider (if distance <= 20)
   4. Setting the visual gap between basket and player images
   5. Updating success % and reps count from statsData
   6. Triggering a full stats summary re-render
   ========================================================================== */
function updateUI(distance) {
    let displayDistance = distance;
    let unitStr = "m";

    // Convert to feet if user toggled to feet mode
    if (!isMeters) {
        displayDistance = Math.round(distance * 3.28084);
        unitStr = "ft";
    }

    // Update distance display text
    distanceText.innerText = displayDistance;
    distanceUnit.innerText = unitStr;

    // Sync slider position (slider only covers 1-20m range)
    if (distance <= 20) distanceSlider.value = distance;

    // Set visual gap between basket and player images.
    // Cap at 20m equivalent (200px) — distances beyond 20m don't increase the visual gap.
    const visualGap = Math.min(distance, 20);
    imageContainer.style.gap = (visualGap * 10) + "px";

    // Fetch stats for this distance (or defaults if no data yet)
    const data = statsData[distance] || { totalBalls: 0, totalMissed: 0, reps: 0 };

    // Display reps count (number of OK-button practice sessions, not individual throws)
    repsDisplay.innerText = data.reps;

    // Calculate and display success percentage
    if (data.totalBalls === 0) {
        successDisplay.innerText = "0";
    } else {
        const success = ((data.totalBalls - data.totalMissed) / data.totalBalls) * 100;
        successDisplay.innerText = Math.round(success);
    }

    // Re-render the full stats bar chart
    renderStatsSummary();
}


/* ==========================================================================
   STATS SUMMARY BAR CHART

   Rebuilds the per-distance bar chart from scratch on every call.
   Each row shows: [distance label] [filled bar] [percentage + hit count]
   Distances are sorted ascending. Distances with zero throws are skipped.
   ========================================================================== */
function renderStatsSummary() {
    if (!statsSummaryContainer) return;

    // Clear previous chart
    statsSummaryContainer.innerHTML = '';

    // Get all logged distances, sorted ascending
    const distances = Object.keys(statsData).map(Number).sort((a, b) => a - b);

    // Show placeholder if no data exists
    if (distances.length === 0) {
        statsSummaryContainer.innerHTML = '<p class="empty-stats">No throws logged yet.</p>';
        return;
    }

    // Build a row for each distance that has throws
    distances.forEach(dist => {
        const data = statsData[dist];
        if (data.totalBalls === 0) return; // Skip distances with no throws

        // Calculate success metrics
        const totalHits = data.totalBalls - data.totalMissed;
        const successRate = Math.round((totalHits / data.totalBalls) * 100);

        // Convert distance to display unit
        let displayDist = dist;
        let unit = "m";
        if (!isMeters) {
            displayDist = Math.round(dist * 3.28084);
            unit = "ft";
        }

        // Create and append the stat row DOM element
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <div class="stat-label">${displayDist}${unit}</div>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${successRate}%"></div>
            </div>
            <div class="stat-meta">
                <div class="stat-percent">${successRate}%</div>
                <div class="stat-count">${totalHits}/${data.totalBalls}</div>
            </div>
        `;
        statsSummaryContainer.appendChild(row);
    });
}


/* ==========================================================================
   DISC COUNT SELECTION (Normal Mode)

   Row of 10 buttons (1-10). Clicking one:
   1. Removes 'active' class from all buttons
   2. Highlights the clicked button
   3. Updates currentBag
   4. Caps currentMissed if it exceeds the new bag size
   ========================================================================== */
numBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Deselect all buttons, then highlight the clicked one
        numBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Update bag count from the button's data attribute
        currentBag = parseInt(e.target.getAttribute('data-val'));

        // Ensure missed count doesn't exceed the new bag size
        if (currentMissed > currentBag) {
            currentMissed = currentBag;
            missedDisplay.innerText = currentMissed;
        }
    });
});


/* ==========================================================================
   MISSED COUNTER (Normal Mode)

   +/- buttons to adjust currentMissed.
   Minimum: 0, Maximum: currentBag (can't miss more than you threw).
   ========================================================================== */
btnMissedMinus.addEventListener('click', () => {
    if (currentMissed > 0) {
        currentMissed--;
        missedDisplay.innerText = currentMissed;
    }
});

btnMissedPlus.addEventListener('click', () => {
    if (currentMissed < currentBag) {
        currentMissed++;
        missedDisplay.innerText = currentMissed;
    }
});


/* ==========================================================================
   GAME MODE — SETUP & FLOW

   Flow: Open setup modal -> Configure min/max/throws -> Start game ->
         Random distance per throw -> Miss/Sink -> Game over modal
   ========================================================================== */

/**
 * Opens the game setup modal.
 * Pre-fills min/max distance inputs based on current unit (meters or feet).
 * Updates unit labels in the modal form.
 */
btnOpenGameSetup.addEventListener('click', () => {
    const minInput = document.getElementById('game-min-dist');
    const maxInput = document.getElementById('game-max-dist');

    // Set default values, converting to feet if needed
    minInput.value = isMeters ? 5 : Math.round(5 * 3.28084);
    maxInput.value = isMeters ? 10 : Math.round(10 * 3.28084);

    // Update unit labels in the modal (e.g., "Min Distance (ft)")
    document.querySelectorAll('.game-unit-label').forEach(el => {
        el.innerText = isMeters ? 'm' : 'ft';
    });

    gameSetupModal.classList.remove('d-none');
});

/** Cancel game setup — hides the modal, returns to normal mode */
document.getElementById('btn-cancel-game').addEventListener('click', () => {
    gameSetupModal.classList.add('d-none');
});

/**
 * Start a new game session.
 * Reads configuration from the setup modal, converts units if needed,
 * transitions UI from normal mode to game mode, and begins the first throw.
 */
document.getElementById('btn-start-game').addEventListener('click', () => {
    // Read user inputs from the setup form
    let minInput = parseInt(document.getElementById('game-min-dist').value);
    let maxInput = parseInt(document.getElementById('game-max-dist').value);
    gameTotalThrows = parseInt(document.getElementById('game-reps').value) || 18;

    // Convert feet input back to meters for internal storage
    if (!isMeters) {
        minInput = Math.round(minInput / 3.28084);
        maxInput = Math.round(maxInput / 3.28084);
    }

    // Ensure min <= max by swapping if needed
    gameMin = Math.max(1, Math.min(minInput, maxInput));
    gameMax = Math.max(minInput, maxInput);

    // Initialize game state
    isGameMode = true;
    gameCurrentThrow = 1;
    gameSessionStats = { totalThrows: 0, totalMissed: 0 };

    // Transition UI: hide normal mode, show game banner
    gameSetupModal.classList.add('d-none');
    btnOpenGameSetup.classList.add('d-none');
    normalTrackingSection.classList.add('d-none');
    gameActiveBanner.classList.remove('d-none');

    // Disable manual distance controls during game
    setManualControlsState(true);

    // Begin first throw
    nextGameThrow();
});

/** Quit game early — no results modal shown */
document.getElementById('btn-quit-game').addEventListener('click', () => endGame(true));

/** Close game over modal */
document.getElementById('btn-close-game-over').addEventListener('click', () => gameOverModal.classList.add('d-none'));

/**
 * Picks a random distance between gameMin and gameMax (inclusive),
 * updates the UI, and displays the throw counter.
 */
function nextGameThrow() {
    const randomDist = Math.floor(Math.random() * (gameMax - gameMin + 1)) + gameMin;
    currentDistance = randomDist;
    updateUI(currentDistance);
    gameProgressText.innerText = `Throw ${gameCurrentThrow} / ${gameTotalThrows}`;
}

/**
 * Records a single throw during game mode.
 *
 * @param {boolean} isSink - true if the throw was successful, false if missed
 *
 * Key design choice: reps is NOT incremented during game mode.
 * This keeps the reps counter as a "focused practice session" metric
 * separate from game play.
 */
function recordGameThrow(isSink) {
    // Initialize stats entry for this distance if it doesn't exist
    if (!statsData[currentDistance]) {
        statsData[currentDistance] = { totalBalls: 0, totalMissed: 0, reps: 0 };
    }

    // Record the throw in the global stats
    statsData[currentDistance].totalBalls += 1;

    let missed = isSink ? 0 : 1;
    statsData[currentDistance].totalMissed += missed;

    // Intentionally NOT incrementing reps — game throws are tracked separately
    // from normal mode practice sessions

    // Update game session accumulator
    gameSessionStats.totalThrows += 1;
    gameSessionStats.totalMissed += missed;

    // Advance to next throw
    gameCurrentThrow++;

    // Check if game is complete
    if (gameCurrentThrow > gameTotalThrows) {
        updateUI(currentDistance);
        endGame();
    } else {
        nextGameThrow();
    }
}

// Wire up game action buttons
document.getElementById('btn-game-sink').addEventListener('click', () => recordGameThrow(true));
document.getElementById('btn-game-miss').addEventListener('click', () => recordGameThrow(false));

/**
 * Ends the current game session and restores normal mode UI.
 * If the game completed normally (not quit early), shows the results modal
 * with score and success rate.
 *
 * @param {boolean} quitEarly - true if user clicked Quit (skip results modal)
 */
function endGame(quitEarly = false) {
    isGameMode = false;

    // Restore normal mode UI elements
    gameActiveBanner.classList.add('d-none');
    normalTrackingSection.classList.remove('d-none');
    btnOpenGameSetup.classList.remove('d-none');
    setManualControlsState(false);

    // Reset to default distance
    currentDistance = 6;
    updateUI(currentDistance);

    // Show results modal if game completed normally
    if (!quitEarly && gameSessionStats.totalThrows > 0) {
        const totalHits = gameSessionStats.totalThrows - gameSessionStats.totalMissed;
        const rate = Math.round((totalHits / gameSessionStats.totalThrows) * 100);

        document.getElementById('game-results-summary').innerHTML = `
            Score: <span style="color:var(--text-main);">${totalHits} / ${gameSessionStats.totalThrows}</span><br>
            Success Rate: <span style="color:var(--text-main);">${rate}%</span>
        `;
        gameOverModal.classList.remove('d-none');
    }
}

/**
 * Toggles the enabled/disabled state of manual distance controls.
 * Used to lock controls during game mode so the user can't change distance.
 *
 * @param {boolean} disabled - true to disable, false to enable
 */
function setManualControlsState(disabled) {
    document.getElementById('btn-left').disabled = disabled;
    document.getElementById('btn-right').disabled = disabled;
    document.getElementById('btn-reset').disabled = disabled;
    document.getElementById('distance-slider').disabled = disabled;
    document.getElementById('distance-slider').style.opacity = disabled ? "0.4" : "1";

    // Fade out and disable pointer events on the controls wrapper
    manualControls.style.opacity = disabled ? "0.4" : "1";
    manualControls.style.pointerEvents = disabled ? "none" : "auto";
}


/* ==========================================================================
   OK BUTTON — NORMAL MODE SAVE

   Saves the current session to statsData for the active distance:
   - Adds currentBag to totalBalls (total discs thrown)
   - Adds currentMissed to totalMissed
   - Increments reps by 1 (counts practice sessions, not individual throws)
   - Resets missed counter to 0 for the next session
   ========================================================================== */
btnOk.addEventListener('click', () => {
    // Initialize stats entry for this distance if it doesn't exist
    if (!statsData[currentDistance]) {
        statsData[currentDistance] = { totalBalls: 0, totalMissed: 0, reps: 0 };
    }

    // Add throws and misses for percentage calculation
    statsData[currentDistance].totalBalls += currentBag;
    statsData[currentDistance].totalMissed += currentMissed;

    // Increment reps by 1 per OK click (not per disc thrown)
    statsData[currentDistance].reps += 1;

    // Reset missed counter for next session
    currentMissed = 0;
    missedDisplay.innerText = currentMissed;
    updateUI(currentDistance);
});


/* ==========================================================================
   MANUAL DISTANCE CONTROLS (Normal Mode)

   - Left arrow: decrement distance (minimum: 1m)
   - Right arrow: increment distance (maximum: 35m)
   - Reset: return to default distance of 6m
   - Slider: direct input for distances 1-20m

   Note: Distances 21-35m are only reachable via the arrow buttons,
   as the slider maxes out at 20.
   ========================================================================== */
document.getElementById('btn-left').addEventListener('click', () => {
    if (currentDistance > 1) { currentDistance--; updateUI(currentDistance); }
});

document.getElementById('btn-right').addEventListener('click', () => {
    if (currentDistance < 35) { currentDistance++; updateUI(currentDistance); }
});

document.getElementById('btn-reset').addEventListener('click', () => {
    currentDistance = 6; updateUI(currentDistance);
});

distanceSlider.addEventListener('input', (e) => {
    currentDistance = parseInt(e.target.value);
    updateUI(currentDistance);
});


/* ==========================================================================
   JSON DATA EXPORT (Download)

   Exports statsData as a pretty-printed JSON file.
   File name format: disc-stats-YYYY-MM-DD.json
   Uses Blob API + temporary anchor element to trigger browser download.
   ========================================================================== */
document.getElementById('btn-download').addEventListener('click', () => {
    const dataStr = JSON.stringify(statsData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create temporary link, trigger download, then clean up
    const a = document.createElement('a');
    a.href = url;
    a.download = `disc-stats-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});


/* ==========================================================================
   JSON DATA IMPORT (Upload)

   Reads a JSON file selected by the user and replaces statsData entirely.
   Uses FileReader API. Shows success/error alert.
   Resets the file input after reading so the same file can be re-uploaded.
   ========================================================================== */
document.getElementById('upload-json').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const uploadedData = JSON.parse(event.target.result);
            statsData = uploadedData;
            updateUI(currentDistance);
            alert("Statistics loaded successfully!");
        } catch (error) {
            alert("Error parsing JSON file. Please ensure it's a valid stats file.");
        }
        // Reset file input so the same file can be re-selected
        e.target.value = '';
    };
    reader.readAsText(file);
});


/* ==========================================================================
   INITIALIZATION
   Set the initial UI state at distance 6 meters.
   ========================================================================== */
updateUI(6);
