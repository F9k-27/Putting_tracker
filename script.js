// Data Storage
let statsData = {}; 

// DOM Elements
const distanceText = document.getElementById('distance-text');
const distanceUnit = document.getElementById('distance-unit');
const distanceSlider = document.getElementById('distance-slider');
const imageContainer = document.getElementById('image-container');
const successDisplay = document.getElementById('success-percent');
const repsDisplay = document.getElementById('reps-total');
const missedDisplay = document.getElementById('missed-display');
const statsSummaryContainer = document.getElementById('stats-summary-container');

// Top / Unit UI
const welcomeModal = document.getElementById('welcome-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnUnitToggle = document.getElementById('btn-unit-toggle');
const btnOpenGameSetup = document.getElementById('btn-open-game-setup');

// Normal Mode UI Elements
const normalTrackingSection = document.getElementById('normal-tracking-section');
const manualControls = document.getElementById('manual-distance-controls');
const numBtns = document.querySelectorAll('.num-btn');
const btnMissedMinus = document.getElementById('missed-minus');
const btnMissedPlus = document.getElementById('missed-plus');
const btnOk = document.getElementById('btn-ok');

// Game Mode UI Elements
const gameSetupModal = document.getElementById('game-setup-modal');
const gameOverModal = document.getElementById('game-over-modal');
const gameActiveBanner = document.getElementById('game-active-banner');
const gameProgressText = document.getElementById('game-progress');

// State Variables
let currentDistance = 6; 
let currentBag = 5;
let currentMissed = 0;
let isMeters = true;

// Game State Variables
let isGameMode = false;
let gameMin = 5;
let gameMax = 10;
let gameTotalThrows = 10;
let gameCurrentThrow = 1;
let gameSessionStats = { totalThrows: 0, totalMissed: 0 };

// Modal Logic
btnCloseModal.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
});

// Unit Toggle Logic
btnUnitToggle.addEventListener('click', () => {
    isMeters = !isMeters;
    btnUnitToggle.innerText = isMeters ? "Unit: Meters" : "Unit: Feet";
    updateUI(currentDistance);
});

// Update UI (Distance & Stats)
function updateUI(distance) {
    let displayDistance = distance;
    let unitStr = "m";
    
    if (!isMeters) {
        displayDistance = Math.round(distance * 3.28084);
        unitStr = "ft";
    }

    distanceText.innerText = displayDistance;
    distanceUnit.innerText = unitStr;

    if (distance <= 20) distanceSlider.value = distance;
    
    const visualGap = Math.min(distance, 20);
    imageContainer.style.gap = (visualGap * 10) + "px";

    const data = statsData[distance] || { totalBalls: 0, totalMissed: 0, reps: 0 };
    repsDisplay.innerText = data.totalBalls; // Show total balls thrown at this distance
    
    if (data.totalBalls === 0) {
        successDisplay.innerText = "0";
    } else {
        const success = ((data.totalBalls - data.totalMissed) / data.totalBalls) * 100;
        successDisplay.innerText = Math.round(success);
    }

    renderStatsSummary();
}

function renderStatsSummary() {
    if (!statsSummaryContainer) return;
    statsSummaryContainer.innerHTML = ''; 
    
    const distances = Object.keys(statsData).map(Number).sort((a, b) => a - b);
    
    if (distances.length === 0) {
        statsSummaryContainer.innerHTML = '<p class="empty-stats">No throws logged yet.</p>';
        return;
    }

    distances.forEach(dist => {
        const data = statsData[dist];
        if (data.totalBalls === 0) return;

        const totalHits = data.totalBalls - data.totalMissed;
        const successRate = Math.round((totalHits / data.totalBalls) * 100);
        
        let displayDist = dist;
        let unit = "m";
        if (!isMeters) {
            displayDist = Math.round(dist * 3.28084);
            unit = "ft";
        }

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

// "My Bag" Bar Logic (Normal Mode)
numBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        numBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentBag = parseInt(e.target.getAttribute('data-val'));
        if (currentMissed > currentBag) {
            currentMissed = currentBag;
            missedDisplay.innerText = currentMissed;
        }
    });
});

// "Missed" Counter Logic (Normal Mode)
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

// --- Putting Game Logic ---
btnOpenGameSetup.addEventListener('click', () => {
    const minInput = document.getElementById('game-min-dist');
    const maxInput = document.getElementById('game-max-dist');
    
    minInput.value = isMeters ? 5 : Math.round(5 * 3.28084);
    maxInput.value = isMeters ? 10 : Math.round(10 * 3.28084);
    
    document.querySelectorAll('.game-unit-label').forEach(el => {
        el.innerText = isMeters ? 'm' : 'ft';
    });
    
    gameSetupModal.classList.remove('d-none');
});

document.getElementById('btn-cancel-game').addEventListener('click', () => {
    gameSetupModal.classList.add('d-none');
});

document.getElementById('btn-start-game').addEventListener('click', () => {
    let minInput = parseInt(document.getElementById('game-min-dist').value);
    let maxInput = parseInt(document.getElementById('game-max-dist').value);
    gameTotalThrows = parseInt(document.getElementById('game-reps').value) || 18;

    if (!isMeters) {
        minInput = Math.round(minInput / 3.28084);
        maxInput = Math.round(maxInput / 3.28084);
    }
    
    gameMin = Math.max(1, Math.min(minInput, maxInput));
    gameMax = Math.max(minInput, maxInput);

    // Enter Game Mode UI
    isGameMode = true;
    gameCurrentThrow = 1;
    gameSessionStats = { totalThrows: 0, totalMissed: 0 };
    
    gameSetupModal.classList.add('d-none');
    btnOpenGameSetup.classList.add('d-none');
    normalTrackingSection.classList.add('d-none');
    
    gameActiveBanner.classList.remove('d-none');
    
    setManualControlsState(true);
    nextGameThrow();
});

document.getElementById('btn-quit-game').addEventListener('click', () => endGame(true));
document.getElementById('btn-close-game-over').addEventListener('click', () => gameOverModal.classList.add('d-none'));

function nextGameThrow() {
    const randomDist = Math.floor(Math.random() * (gameMax - gameMin + 1)) + gameMin;
    currentDistance = randomDist;
    updateUI(currentDistance);
    gameProgressText.innerText = `Throw ${gameCurrentThrow} / ${gameTotalThrows}`;
}

function recordGameThrow(isSink) {
    if (!statsData[currentDistance]) {
        statsData[currentDistance] = { totalBalls: 0, totalMissed: 0, reps: 0 };
    }

    // Log exactly 1 throw to the database
    statsData[currentDistance].totalBalls += 1;
    statsData[currentDistance].reps += 1;
    
    let missed = isSink ? 0 : 1;
    statsData[currentDistance].totalMissed += missed;

    gameSessionStats.totalThrows += 1;
    gameSessionStats.totalMissed += missed;

    gameCurrentThrow++;

    if (gameCurrentThrow > gameTotalThrows) {
        updateUI(currentDistance); 
        endGame();
    } else {
        nextGameThrow();
    }
}

document.getElementById('btn-game-sink').addEventListener('click', () => recordGameThrow(true));
document.getElementById('btn-game-miss').addEventListener('click', () => recordGameThrow(false));

function endGame(quitEarly = false) {
    isGameMode = false;
    
    // Restore Normal UI
    gameActiveBanner.classList.add('d-none');
    normalTrackingSection.classList.remove('d-none');
    btnOpenGameSetup.classList.remove('d-none');
    setManualControlsState(false);
    
    // Reset to a default distance visually
    currentDistance = 6;
    updateUI(currentDistance);
    
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

function setManualControlsState(disabled) {
    document.getElementById('btn-left').disabled = disabled;
    document.getElementById('btn-right').disabled = disabled;
    document.getElementById('btn-reset').disabled = disabled;
    document.getElementById('distance-slider').disabled = disabled;
    document.getElementById('distance-slider').style.opacity = disabled ? "0.4" : "1";
    // Also fade the visual buttons
    manualControls.style.opacity = disabled ? "0.4" : "1";
    manualControls.style.pointerEvents = disabled ? "none" : "auto";
}

// OK Button (Normal Mode Save)
btnOk.addEventListener('click', () => {
    if (!statsData[currentDistance]) {
        statsData[currentDistance] = { totalBalls: 0, totalMissed: 0, reps: 0 };
    }

    statsData[currentDistance].totalBalls += currentBag;
    statsData[currentDistance].totalMissed += currentMissed;
    statsData[currentDistance].reps += 1;

    currentMissed = 0;
    missedDisplay.innerText = currentMissed;
    updateUI(currentDistance);
});

// Manual Distance Controls (Normal Mode)
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

// JSON Download
document.getElementById('btn-download').addEventListener('click', () => {
    const dataStr = JSON.stringify(statsData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `disc-stats-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// JSON Upload
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
        e.target.value = ''; 
    };
    reader.readAsText(file);
});

// Initial Load
updateUI(6);