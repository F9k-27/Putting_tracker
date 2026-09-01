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

// -- Stance selector (shared between normal and game mode) --
const stanceSelect = document.getElementById('stance-select');           // Stance dropdown
const stanceJumpOption = document.getElementById('stance-jump-option');  // "Jump Putt" option (distance-gated)
const btnToggleStance = document.getElementById('btn-toggle-stance');    // Show/hide the stance selector
const stanceSelector = document.getElementById('stance-selector');       // Stance selector wrapper (hidden by default)
const gameStanceDisplay = document.getElementById('game-stance-display'); // Stance line in the game banner
const gameStanceName = document.getElementById('game-stance-name');      // Random stance name shown during a game

/* Ordered list of stances. `requiresOver10` marks stances only valid when
   the distance is greater than 10 m (currently just Jump Putt). Labels here
   must stay in sync with the <option>s in index.html. */
const STANCES = [
    { value: 'staggered', label: 'Staggered Stance' },
    { value: 'straddle',  label: 'Straddle' },
    { value: 'kneeling',  label: 'Kneeling Putt' },
    { value: 'turbo',     label: 'Turbo Putt' },
    { value: 'split',     label: 'Split Stance' },
    { value: 'lunge',     label: 'Lunge Putt' },
    { value: 'jump',      label: 'Jump Putt', requiresOver10: true },
];


/* ==========================================================================
   STATE VARIABLES
   ========================================================================== */

// -- Normal mode state --
let currentDistance = 6;   // Active distance in meters (range: 1-35)
let currentBag = 5;        // Number of discs selected (range: 1-10)
let currentMissed = 0;     // Missed throws in current session (reset after OK)
let isMeters = true;       // Display unit: true = meters, false = feet
let currentStance = 'staggered'; // Selected putting stance (label only for now — not yet tracked in stats)

// -- Game mode state --
let isGameMode = false;    // Whether game mode is currently active
let gameMin = 5;           // Minimum random distance (meters)
let gameMax = 10;          // Maximum random distance (meters)
let gameTotalThrows = 10;  // Total throws configured for this game session
let gameCurrentThrow = 1;  // Current throw number (1-indexed)
let gameSessionStats = { totalThrows: 0, totalMissed: 0 }; // Game session accumulator
let randomizeStanceInGame = false; // Whether the game picks a random stance each throw


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

    // Enable/disable the distance-gated "Jump Putt" stance option
    updateStanceOptions();

    // Re-render the full stats bar chart
    renderStatsSummary();
}


/* ==========================================================================
   STANCE SELECTOR

   Currently a label-only selector (the chosen stance is not yet written to
   statsData — that will come later). The one piece of live behavior is the
   "Jump Putt" option, which is only valid for distances greater than 10 m.

   updateStanceOptions() hides/disables that option when the current distance
   is 10 m or less, and quietly reverts the selection to the default stance
   if Jump Putt was selected when the distance dropped out of range.
   ========================================================================== */
function updateStanceOptions() {
    const jumpAllowed = currentDistance > 10;

    // Toggle the Jump Putt option's visibility/availability
    stanceJumpOption.hidden = !jumpAllowed;
    stanceJumpOption.disabled = !jumpAllowed;

    // If Jump Putt was selected but is no longer valid, fall back to default
    if (!jumpAllowed && currentStance === 'jump') {
        currentStance = 'staggered';
        stanceSelect.value = currentStance;
    }
}

// Keep currentStance in sync with the dropdown
stanceSelect.addEventListener('change', (e) => {
    currentStance = e.target.value;
});

// Toggle icon: reveal/hide the stance selector (hidden by default)
btnToggleStance.addEventListener('click', () => {
    const nowHidden = stanceSelector.classList.toggle('d-none');
    btnToggleStance.classList.toggle('active', !nowHidden);
    btnToggleStance.setAttribute('aria-pressed', String(!nowHidden));
});

/** Returns the human-readable label for a stance value. */
function stanceLabel(value) {
    const s = STANCES.find(st => st.value === value);
    return s ? s.label : value;
}

/** Picks a random stance valid for the given distance (respects the >10 m rule). */
function pickRandomStance(distance) {
    const valid = STANCES.filter(s => !s.requiresOver10 || distance > 10);
    return valid[Math.floor(Math.random() * valid.length)];
}


/* ==========================================================================
   AIM / TARGET TRACKER  (crosshair toggle)

   When active, the basket+player visual is replaced by a large clickable
   basket. The user taps to mark where each disc landed; after `currentBag`
   marks the "set" is committed to targetData (keyed by distance) and the
   markers reset for the next set.

   Data is session-only (in memory) — it is NOT written to the JSON
   download/upload, keeping that format unchanged. It powers the End
   Practice heatmaps.

   targetData shape: { [distanceMeters]: [ { x, y }, ... ] }
   where x/y are normalized 0..1 positions within the basket image.
   ========================================================================== */

// -- Target tracker DOM refs --
const btnToggleTarget = document.getElementById('btn-toggle-target');   // Crosshair toggle
const landingModal = document.getElementById('landing-modal');          // Landing-input popup
const landingDistanceLabel = document.getElementById('landing-distance'); // Distance shown in popup
const btnLandingDone = document.getElementById('btn-landing-done');     // Finish/close popup
const targetBasket = document.getElementById('target-basket');          // Clickable basket wrapper
const targetMarkers = document.getElementById('target-markers');        // Marker dots overlay
const targetProgress = document.getElementById('target-progress');      // "Marks: n / bag" line

// -- Heatmap DOM refs --
const heatmapModal = document.getElementById('heatmap-modal');
const heatmapModalContent = document.getElementById('heatmap-modal-content');

// -- Target tracker state --
let isTargetMode = false;   // Whether crosshair mode is armed (records landings after OK)
let targetData = {};        // Session-only landing positions, keyed by distance
let currentSet = [];        // Marks placed in the currently-open landing popup
let landingDistance = 6;    // Distance captured when the popup opened
let landingBag = 5;         // Number of marks expected (bag size at OK time)

/**
 * Arms or disarms crosshair mode. This no longer changes the main screen —
 * the basket/player visual and distance controls stay put. When armed, the
 * landing-input popup opens after the user clicks OK.
 */
function setTargetMode(on) {
    isTargetMode = on;
    btnToggleTarget.classList.toggle('active', on);
    btnToggleTarget.setAttribute('aria-pressed', String(on));
}

// Crosshair toggle — unavailable during a game session
btnToggleTarget.addEventListener('click', () => {
    if (isGameMode) return;
    setTargetMode(!isTargetMode);
});

/** Updates the "Marks: n / bag" progress readout in the popup. */
function updateTargetProgress() {
    targetProgress.innerText = `Marks: ${currentSet.length} / ${landingBag}`;
}

/** Rebuilds the marker dots from the current in-progress set. */
function renderMarkers() {
    targetMarkers.innerHTML = '';
    currentSet.forEach(p => {
        const dot = document.createElement('div');
        dot.className = 'target-marker';
        dot.style.left = (p.x * 100) + '%';
        dot.style.top = (p.y * 100) + '%';
        targetMarkers.appendChild(dot);
    });
}

/**
 * Opens the landing-input popup for the current distance/bag.
 * Called from the OK handler when crosshair mode is armed.
 */
function openLandingModal() {
    landingDistance = currentDistance;
    landingBag = currentBag;
    currentSet = [];
    renderMarkers();
    updateTargetProgress();
    landingDistanceLabel.textContent = formatDistance(landingDistance);
    landingModal.classList.remove('d-none');
}

/**
 * Stores whatever marks were placed into targetData for the captured
 * distance, then closes the popup. Safe to call with zero marks.
 */
function commitLanding() {
    if (currentSet.length) {
        if (!targetData[landingDistance]) targetData[landingDistance] = [];
        targetData[landingDistance].push(...currentSet);
    }
    currentSet = [];
    landingModal.classList.add('d-none');
    renderMarkers();
}

// Tap the basket to record a landing position (only while the popup is open)
targetBasket.addEventListener('click', (e) => {
    if (landingModal.classList.contains('d-none')) return;
    if (currentSet.length >= landingBag) return; // all discs already marked

    const rect = targetBasket.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

    currentSet.push({ x, y });
    renderMarkers();
    updateTargetProgress();

    // Auto-finish once every disc has been placed
    if (currentSet.length >= landingBag) commitLanding();
});

// "Done" — commit early (fewer marks than bag) and close
btnLandingDone.addEventListener('click', commitLanding);


/* ==========================================================================
   HEATMAP RENDERING

   A lightweight density heatmap drawn on a <canvas> overlaid on the basket
   image. The canvas only ever draws our own gradients (never the basket
   image itself), so getImageData() stays untainted even under file://.
   ========================================================================== */

/** Maps intensity t (0..1) to a blue→cyan→green→yellow→red heat color. */
function heatColor(t) {
    const stops = [
        [0.00, [0, 0, 255]],
        [0.25, [0, 255, 255]],
        [0.50, [0, 255, 0]],
        [0.75, [255, 255, 0]],
        [1.00, [255, 0, 0]],
    ];
    for (let i = 1; i < stops.length; i++) {
        if (t <= stops[i][0]) {
            const [t0, c0] = stops[i - 1];
            const [t1, c1] = stops[i];
            const f = (t - t0) / (t1 - t0);
            return [
                Math.round(c0[0] + f * (c1[0] - c0[0])),
                Math.round(c0[1] + f * (c1[1] - c0[1])),
                Math.round(c0[2] + f * (c1[2] - c0[2])),
            ];
        }
    }
    return [255, 0, 0];
}

/** Draws a density heatmap of normalized points onto the given canvas. */
function drawHeatmap(canvas, points, radiusFactor = 0.14) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!points.length) return;

    const radius = Math.max(w, h) * radiusFactor;

    // 1) Accumulate grayscale intensity with additive radial gradients
    points.forEach(p => {
        const px = p.x * w, py = p.y * h;
        const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
        g.addColorStop(0, 'rgba(0,0,0,0.35)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // 2) Colorize each pixel by its accumulated alpha
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    let maxA = 1;
    for (let i = 3; i < d.length; i += 4) if (d[i] > maxA) maxA = d[i];
    for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3];
        if (a === 0) continue;
        const [r, g, b] = heatColor(Math.min(a / maxA, 1));
        d[i] = r; d[i + 1] = g; d[i + 2] = b;
        d[i + 3] = Math.min(255, Math.round(a * 1.4));
    }
    ctx.putImageData(img, 0, 0);
}

/** Builds a basket image with an overlaid heatmap canvas and optional labels. */
function makeHeatmapWrap(densityPoints, labelPoints) {
    const wrap = document.createElement('div');
    wrap.className = 'heatmap-wrap';

    const img = document.createElement('img');
    img.src = 'images/Basketbig.png';
    img.alt = 'Basket';
    img.onerror = function () { this.onerror = null; this.src = 'images/basket.png'; };
    wrap.appendChild(img);

    const canvas = document.createElement('canvas');
    canvas.className = 'heatmap-canvas';
    canvas.width = 260;
    canvas.height = 260;
    drawHeatmap(canvas, densityPoints);   // Detached canvas draws fine
    wrap.appendChild(canvas);

    (labelPoints || []).forEach(lp => {
        const label = document.createElement('div');
        label.className = 'heatmap-label';
        label.style.left = (lp.x * 100) + '%';
        label.style.top = (lp.y * 100) + '%';
        label.textContent = lp.text;
        wrap.appendChild(label);
    });

    return wrap;
}

/** Mean (centroid) of a set of normalized points. */
function centroid(points) {
    let sx = 0, sy = 0;
    points.forEach(p => { sx += p.x; sy += p.y; });
    return { x: sx / points.length, y: sy / points.length };
}

/** Mean distance of points from a center — a grouping-spread measure. */
function dispersion(points, c) {
    if (points.length < 2) return 0;
    let s = 0;
    points.forEach(p => { s += Math.hypot(p.x - c.x, p.y - c.y); });
    return s / points.length;
}

/** Returns sorted list of distances that have landing marks. */
function distancesWithMarks() {
    return Object.keys(targetData)
        .map(Number)
        .filter(d => targetData[d] && targetData[d].length)
        .sort((a, b) => a - b);
}

/**
 * Appends the aggregate "landing heatmap" (all marks) with per-distance
 * average-position labels, plus a button to open the per-distance modal.
 * Called at the end of renderPracticeSummary(). No-op if no marks exist.
 */
function renderSummaryHeatmap() {
    const distances = distancesWithMarks();
    if (!distances.length) return;

    const allMarks = [];
    const labelPoints = [];
    distances.forEach(d => {
        targetData[d].forEach(p => allMarks.push(p));
        const c = centroid(targetData[d]);
        labelPoints.push({ x: c.x, y: c.y, text: formatDistance(d) });
    });

    const title = document.createElement('div');
    title.className = 'heatmap-section-title';
    title.textContent = `Landing Heatmap (${allMarks.length} marks)`;
    practiceSummaryContent.appendChild(title);

    const caption = document.createElement('p');
    caption.style.cssText = 'font-size:12px;color:var(--text-muted);margin:0 0 6px;';
    caption.textContent = 'Labels show your average landing spot per distance.';
    practiceSummaryContent.appendChild(caption);

    practiceSummaryContent.appendChild(makeHeatmapWrap(allMarks, labelPoints));

    const btn = document.createElement('button');
    btn.className = 'btn-secondary';
    btn.style.cssText = 'width:100%;margin-top:12px;';
    btn.textContent = 'Per-distance heatmaps & stats';
    btn.addEventListener('click', () => {
        renderDistanceHeatmaps();
        heatmapModal.classList.remove('d-none');
    });
    practiceSummaryContent.appendChild(btn);
}

/** Renders one heatmap + grouping stats block per practiced distance. */
function renderDistanceHeatmaps() {
    heatmapModalContent.innerHTML = '';
    const distances = distancesWithMarks();

    if (!distances.length) {
        heatmapModalContent.innerHTML = '<p class="empty-stats">No landing marks recorded yet.</p>';
        return;
    }

    distances.forEach(d => {
        const marks = targetData[d];
        const c = centroid(marks);
        const spread = dispersion(marks, c);

        const block = document.createElement('div');
        block.className = 'heat-block';

        const h = document.createElement('h3');
        h.textContent = `${formatDistance(d)} · ${marks.length} marks`;
        block.appendChild(h);

        block.appendChild(makeHeatmapWrap(marks, [{ x: c.x, y: c.y, text: 'avg' }]));

        // Directional bias (assumes basket center ≈ 0.5, 0.5) and a
        // consistency score derived from how tight the grouping is.
        const horiz = c.x < 0.45 ? 'left' : c.x > 0.55 ? 'right' : 'center';
        const vert = c.y < 0.45 ? 'high' : c.y > 0.55 ? 'low' : 'center';
        const consistency = Math.max(0, Math.round((1 - Math.min(spread / 0.35, 1)) * 100));

        const stats = document.createElement('div');
        stats.className = 'heat-stats';
        stats.innerHTML = `
            <span>Marks: <b>${marks.length}</b></span>
            <span>Consistency: <b>${consistency}%</b></span>
            <span>Horizontal: <b>${horiz}</b></span>
            <span>Vertical: <b>${vert}</b></span>
        `;
        block.appendChild(stats);

        heatmapModalContent.appendChild(block);
    });
}

// Close the per-distance heatmap modal
document.getElementById('btn-close-heatmap').addEventListener('click', () => {
    heatmapModal.classList.add('d-none');
});


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

    // Leave target (crosshair) mode if it was active — game uses the visual basket
    if (isTargetMode) setTargetMode(false);

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
    btnToggleTarget.classList.add('d-none');   // Hide accuracy toggle during a game
    normalTrackingSection.classList.add('d-none');
    gameActiveBanner.classList.remove('d-none');

    // Disable manual distance controls during game
    setManualControlsState(true);

    // Read the randomize-stance option; show the stance line only when enabled
    randomizeStanceInGame = document.getElementById('game-random-stance').checked;
    gameStanceDisplay.classList.toggle('d-none', !randomizeStanceInGame);

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

    // If enabled, suggest a fresh random stance for this throw (valid for the distance)
    if (randomizeStanceInGame) {
        const stance = pickRandomStance(currentDistance);
        currentStance = stance.value;
        stanceSelect.value = currentStance;
        gameStanceName.innerText = stance.label;
    }
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
    gameStanceDisplay.classList.add('d-none');
    normalTrackingSection.classList.remove('d-none');
    btnOpenGameSetup.classList.remove('d-none');
    btnToggleTarget.classList.remove('d-none');   // Restore accuracy toggle after the game
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

    // If crosshair mode is armed, prompt for where each disc landed
    if (isTargetMode) openLandingModal();
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
   PRACTICE SUMMARY

   Opened by the "End Practice" button. Aggregates the entire statsData
   object into a single session overview and renders it into the
   practice summary modal. Purely a read-only view — it does not modify
   or reset any stored data.

   Stats shown:
     - Total putts thrown, made, and missed
     - Overall success rate (%)
     - Number of distinct distances practiced
     - Total practice sessions (sum of reps from normal mode)
     - Best distance (highest success rate)
     - Toughest distance (lowest success rate)
     - Longest distance made (furthest distance with at least one sink)
   ========================================================================== */
const practiceSummaryModal = document.getElementById('practice-summary-modal');
const practiceSummaryContent = document.getElementById('practice-summary-content');

/** Formats a meters value into the currently active display unit. */
function formatDistance(distMeters) {
    return isMeters ? `${distMeters}m` : `${Math.round(distMeters * 3.28084)}ft`;
}

/**
 * Builds the practice summary DOM and injects it into the modal.
 * Called each time the modal opens so the numbers are always current.
 */
function renderPracticeSummary() {
    // Only consider distances that actually have throws logged
    const distances = Object.keys(statsData)
        .map(Number)
        .filter(d => statsData[d] && statsData[d].totalBalls > 0)
        .sort((a, b) => a - b);

    // No normal-mode data — but target-mode marks may still exist
    if (distances.length === 0) {
        if (distancesWithMarks().length === 0) {
            practiceSummaryContent.innerHTML =
                '<p class="empty-stats">No putts logged yet. Go throw some discs!</p>';
        } else {
            practiceSummaryContent.innerHTML =
                '<p class="empty-stats">No counted putts — showing your landing marks.</p>';
            renderSummaryHeatmap();
        }
        return;
    }

    // Aggregate totals and find the best / toughest / longest-made distances
    let totalPutts = 0;
    let totalMissed = 0;
    let totalSessions = 0;
    let best = null;        // { dist, rate }
    let toughest = null;    // { dist, rate }
    let longestMade = null; // furthest distance (meters) with at least one sink

    distances.forEach(dist => {
        const data = statsData[dist];
        totalPutts += data.totalBalls;
        totalMissed += data.totalMissed;
        totalSessions += data.reps || 0;

        const madeAtDist = data.totalBalls - data.totalMissed;
        const rate = madeAtDist / data.totalBalls;

        if (!best || rate > best.rate) best = { dist, rate };
        if (!toughest || rate < toughest.rate) toughest = { dist, rate };
        if (madeAtDist > 0 && (longestMade === null || dist > longestMade)) {
            longestMade = dist;
        }
    });

    const totalMade = totalPutts - totalMissed;
    const overallRate = Math.round((totalMade / totalPutts) * 100);

    // -- Top grid of headline numbers --
    const cards = [
        { value: totalPutts, label: 'Total Putts' },
        { value: totalMade, label: 'Made' },
        { value: totalMissed, label: 'Missed' },
        { value: `${overallRate}%`, label: 'Success Rate' },
        { value: distances.length, label: 'Distances' },
        { value: totalSessions, label: 'Sessions' },
    ];

    const cardsHtml = cards.map(c => `
        <div class="summary-card">
            <div class="summary-value">${c.value}</div>
            <div class="summary-label">${c.label}</div>
        </div>
    `).join('');

    // -- Highlight rows (best / toughest / longest made) --
    const highlights = [
        {
            icon: '🎯',
            label: 'Best distance',
            value: `${formatDistance(best.dist)} · ${Math.round(best.rate * 100)}%`,
        },
        {
            icon: '💪',
            label: 'Toughest distance',
            value: `${formatDistance(toughest.dist)} · ${Math.round(toughest.rate * 100)}%`,
        },
        {
            icon: '🚀',
            label: 'Longest made',
            value: longestMade !== null ? formatDistance(longestMade) : '—',
        },
    ];

    const highlightsHtml = highlights.map(h => `
        <div class="summary-highlight">
            <span class="summary-highlight-label">${h.icon} ${h.label}</span>
            <span class="summary-highlight-value">${h.value}</span>
        </div>
    `).join('');

    practiceSummaryContent.innerHTML = `
        <div class="summary-grid">${cardsHtml}</div>
        <div class="summary-highlights">${highlightsHtml}</div>
    `;

    // Append the landing heatmap section if any target marks were recorded
    renderSummaryHeatmap();
}

// Open the summary modal (rebuild content first so it's up to date)
document.getElementById('btn-end-practice').addEventListener('click', () => {
    renderPracticeSummary();
    practiceSummaryModal.classList.remove('d-none');
});

// Close the summary modal
document.getElementById('btn-close-practice-summary').addEventListener('click', () => {
    practiceSummaryModal.classList.add('d-none');
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
