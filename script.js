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
const statsSummaryContainer = document.getElementById('stats-summary-container'); // NEW: Scale bars container

// Modal Elements
const welcomeModal = document.getElementById('welcome-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

// Unit Toggle Elements
const btnUnitToggle = document.getElementById('btn-unit-toggle');

// Bag Bar Buttons
const numBtns = document.querySelectorAll('.num-btn');
const btnMissedMinus = document.getElementById('missed-minus');
const btnMissedPlus = document.getElementById('missed-plus');

// State Variables
let currentDistance = 6; // Always tracked internally in meters
let currentBag = 5;
let currentMissed = 0;
let isMeters = true;

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
    // 1. Calculate the Display Distance based on selected unit
    let displayDistance = distance;
    let unitStr = "m";
    
    if (!isMeters) {
        // Convert meters to feet and round to a whole number
        displayDistance = Math.round(distance * 3.28084);
        unitStr = "ft";
    }

    // Update Distance text and unit
    distanceText.innerText = displayDistance;
    distanceUnit.innerText = unitStr;

    // 2. Update Slider and Visuals (these always scale based on meters 1-20)
    if (distance <= 20) distanceSlider.value = distance;
    
    const visualGap = Math.min(distance, 20);
    imageContainer.style.gap = (visualGap * 10) + "px";

    // 3. Update Stats for this specific meter distance
    const data = statsData[distance] || { totalBalls: 0, totalMissed: 0, reps: 0 };
    repsDisplay.innerText = data.reps;
    
    if (data.totalBalls === 0) {
        successDisplay.innerText = "0";
    } else {
        const success = ((data.totalBalls - data.totalMissed) / data.totalBalls) * 100;
        successDisplay.innerText = Math.round(success);
    }

    // 4. Update the visual scale bars for all distances
    renderStatsSummary();
}

// Render Scale Bars for All Played Distances
function renderStatsSummary() {
    if (!statsSummaryContainer) return; // Safety check if HTML isn't updated yet

    statsSummaryContainer.innerHTML = ''; // Clear current bars
    
    // Get all recorded distances and sort them numerically
    const distances = Object.keys(statsData).map(Number).sort((a, b) => a - b);
    
    if (distances.length === 0) {
        statsSummaryContainer.innerHTML = '<p class="empty-stats">No throws logged yet.</p>';
        return;
    }

    distances.forEach(dist => {
        const data = statsData[dist];
        if (data.totalBalls === 0) return; // Skip if no balls thrown

        // Calculate success percentage
        const successRate = Math.round(((data.totalBalls - data.totalMissed) / data.totalBalls) * 100);
        
        // Handle Unit conversion for the label
        let displayDist = dist;
        let unit = "m";
        if (!isMeters) {
            displayDist = Math.round(dist * 3.28084);
            unit = "ft";
        }

        // Create the row element
        const row = document.createElement('div');
        row.className = 'stat-row';
        
        row.innerHTML = `
            <div class="stat-label">${displayDist}${unit}</div>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${successRate}%"></div>
            </div>
            <div class="stat-percent">${successRate}%</div>
        `;
        
        statsSummaryContainer.appendChild(row);
    });
}

// "My Bag" Bar Logic
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

// "Missed" Counter Logic
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

// OK Button - Log the Data
document.getElementById('btn-ok').addEventListener('click', () => {
    if (!statsData[currentDistance]) {
        statsData[currentDistance] = { totalBalls: 0, totalMissed: 0, reps: 0 };
    }

    statsData[currentDistance].totalBalls += currentBag;
    statsData[currentDistance].totalMissed += currentMissed;
    statsData[currentDistance].reps += 1;

    updateUI(currentDistance);
});

// Distance Controls
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