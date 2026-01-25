// --- NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    window.scrollTo(0, 0);
}

// --- DATA: Materials & Tech Tips ---
const materialsDB = {
    'P': {
        name: "Stal (ISO P)",
        desc: "Stale niestopowe i niskostopowe. Podstawowy materiał w obróbce.",
        badge: "iso-p",
        tips: [
            "Chłodziwo: Zalecana emulsja (6-8%) dla HSS. Dla VHM przy frezowaniu na sucho (wiór niebieski to dobry znak), wiercenie z chłodziwem.",
            "Wiór: Długi/ciągliwy. Ważny dobór łamacza wióra.",
            "Strategia: Wysokie Vc, średnie posuwy. Węglik lubi obroty."
        ],
        baseVc: { 'HSS': "25-35", 'HSS-Co': "30-45", 'VHM': "140-220" }
    },
    'M': {
        name: "Stal Nierdzewna (ISO M)",
        desc: "Austenityczne, martenzytyczne (INOX, 304, 316).",
        badge: "iso-m",
        tips: [
            "Utwardzanie: Materiał utwardza się pod ostrzem! Nie zatrzymuj narzędzia w materiale.",
            "Chłodziwo: Obfite (10%+), wysokie ciśnienie bardzo pomaga.",
            "Strategia: Mniejsze Vc niż w stali, ale konkretny posuw (nie głaskać). Narzędzia ostre, dodatni kąt natarcia."
        ],
        baseVc: { 'HSS': "10-20", 'HSS-Co': "15-25", 'VHM': "60-120" }
    },
    'K': {
        name: "Żeliwo (ISO K)",
        desc: "Żeliwo szare (GG), sferoidalne (GGG).",
        badge: "iso-k",
        tips: [
            "Wiór: Krótki, pylący. Uwaga na prowadnice maszyny.",
            "Chłodziwo: Często na sucho lub powietrze (szok termiczny niszczy płytki).",
            "Strategia: Materiał ścierający. Używać twardych gatunków węglika (K)."
        ],
        baseVc: { 'HSS': "20-30", 'HSS-Co': "25-40", 'VHM': "100-180" }
    },
    'N': {
        name: "Aluminium / Nieżelazne (ISO N)",
        desc: "Aluminium, Miedź, Mosiądz, Brąz.",
        badge: "iso-n",
        tips: [
            "Narost: Aluminium klei się do ostrza. Używać polerowanych narzędzi (niepowlekanych lub DLC).",
            "Chłodziwo: Bardzo ważne do wypłukiwania wiórów i smarowania.",
            "Strategia: Maksymalne obroty (ile fabryka dała), bardzo wysokie posuwy. High Speed Machining."
        ],
        baseVc: { 'HSS': "60-120", 'HSS-Co': "80-150", 'VHM': "300-1000" }
    },
    'S': {
        name: "Superstopy / Tytan (ISO S)",
        desc: "Tytan, Inconel, Hastelloy.",
        badge: "iso-s",
        tips: [
            "Ciepło: Materiał źle przewodzi ciepło - wszystko idzie w narzędzie.",
            "Strategia: Niskie Vc (bardzo niskie!), stały posuw. Unikać wibracji.",
            "Narzędzia: Węglik drobnoziarnisty, duża liczba ostrzy (dla Inconelu)."
        ],
        baseVc: { 'HSS': "5-10", 'HSS-Co': "8-12", 'VHM': "25-60" }
    },
    'H': {
        name: "Materiały Hartowane (ISO H)",
        desc: "Stale >45 HRC do 65 HRC.",
        badge: "iso-h",
        tips: [
            "Sztywność: Wymagana absolutna sztywność układu.",
            "Narzędzia: Tylko VHM dedykowane lub CBN.",
            "Strategia: Mała głębokość skrawania (ap), mały krok boczny (ae), szybki posuw."
        ],
        baseVc: { 'HSS': "-", 'HSS-Co': "2-5", 'VHM': "40-90" }
    }
};

// --- LOGIC: Library & Tech Tips ---
function updateLibrary() {
    const group = document.getElementById('lib-mat').value;
    const data = materialsDB[group];

    // Update Header & Badge
    document.getElementById('lib-name').innerText = data.name;
    document.getElementById('lib-desc').innerText = data.desc;
    const badge = document.getElementById('lib-badge');
    badge.className = `absolute top-6 right-6 iso-badge ${data.badge} text-sm w-8 h-8 leading-8`;
    badge.innerText = group;

    // Update Vc Table
    document.getElementById('lib-vc-hss').innerText = data.baseVc['HSS'];
    document.getElementById('lib-vc-hssco').innerText = data.baseVc['HSS-Co'];
    document.getElementById('lib-vc-vhm').innerText = data.baseVc['VHM'];

    // Update Tech Tips
    const tipsList = document.getElementById('lib-tips');
    tipsList.innerHTML = "";
    data.tips.forEach(tip => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="text-amber-500 mr-2">•</span> ${tip}`;
        tipsList.appendChild(li);
    });
}

// --- LOGIC: Power Calculator ---
function calculatePower() {
    // Inputs
    const kc = parseFloat(document.getElementById('power-mat').value); // Specific cutting force N/mm2
    const ap = parseFloat(document.getElementById('p-ap').value); // mm
    const ae = parseFloat(document.getElementById('p-ae').value); // mm
    const f = parseFloat(document.getElementById('p-f').value); // mm/min
    const s = parseFloat(document.getElementById('p-s').value); // rpm

    if (kc && ap && ae && f) {
        // 1. MRR (cm3/min) = (ap * ae * f) / 1000
        const mrr = (ap * ae * f) / 1000;

        // 2. Power Pc (kW) = (MRR * kc) / (60 * 10^3 * efficiency)
        // Simplified formula: Pc = (ap * ae * vf * kc) / (60 * 10^6 * eta)
        // Let's assume efficiency eta = 0.8
        const power = (mrr * kc) / (60 * 1000 * 0.8);

        document.getElementById('res-power').innerText = power.toFixed(2);

        // 3. Torque Mc (Nm) = (9550 * Pc) / n
        if (s > 0) {
            const torque = (9550 * power) / s;
            document.getElementById('res-torque').innerText = torque.toFixed(1);
        } else {
            document.getElementById('res-torque').innerText = "0.0";
        }
    }
}

// --- LOGIC: Trigonometry ---
function calcChamferCoords() {
    const c = parseFloat(document.getElementById('trig-c').value);
    const a = parseFloat(document.getElementById('trig-a').value);
    const r = parseFloat(document.getElementById('trig-r').value) || 0;

    if (c && a) {
        // Angle in Radians
        const rad = a * (Math.PI / 180);

        // Correction calculation for Virtual Tip (Programming center of imaginary sharp corner)
        // Standard logic: We want to move the virtual tip so the radius cuts the chamfer.

        // Z Offset (Start Point Shift): Shift needed to transition from straight to angle
        // Formula: R * (1 - tan(a/2)) 
        // Wait, tan(a/2) is for internal corner? 
        // For 90 deg corner turning to Angle A relative to Z axis.
        // Delta Z = R * (1 - tan(A/2))
        // Delta X = R * (1 - tan((90-A)/2))

        const tanHalfA = Math.tan(rad / 2);
        const tanHalfCompA = Math.tan(((90 - a) * (Math.PI / 180)) / 2);

        const zShift = r * (1 - tanHalfA);
        const xShift = r * (1 - tanHalfCompA);

        document.getElementById('res-chamfer-z').innerText = zShift.toFixed(3);
        document.getElementById('res-chamfer-x').innerText = xShift.toFixed(3);
    }
}

function solveTriangle() {
    const a = parseFloat(document.getElementById('tri-a').value);
    const b = parseFloat(document.getElementById('tri-b').value);
    const c = parseFloat(document.getElementById('tri-c').value);

    // Pythagoras a2 + b2 = c2
    if (a && b && !c) {
        document.getElementById('tri-c').value = Math.sqrt(a * a + b * b).toFixed(3);
    } else if (c && a && !b) {
        document.getElementById('tri-b').value = Math.sqrt(c * c - a * a).toFixed(3);
    } else if (c && b && !a) {
        document.getElementById('tri-a').value = Math.sqrt(c * c - b * b).toFixed(3);
    } else {
        alert("Wpisz dwie wartości aby obliczyć trzecią.");
    }
}

// --- LOGIC: ISO Tolerances (Expanded) ---
const isoData = {
    'H6': [[3, 6, 0], [6, 8, 0], [10, 9, 0], [18, 11, 0], [30, 13, 0], [50, 16, 0], [80, 19, 0]],
    'H7': [[3, 10, 0], [6, 12, 0], [10, 15, 0], [18, 18, 0], [30, 21, 0], [50, 25, 0], [80, 30, 0]],
    'H8': [[3, 14, 0], [6, 18, 0], [10, 22, 0], [18, 27, 0], [30, 33, 0], [50, 39, 0], [80, 46, 0]],
    'H9': [[3, 25, 0], [6, 30, 0], [10, 36, 0], [18, 43, 0], [30, 52, 0], [50, 62, 0], [80, 74, 0]],
    'H11': [[3, 60, 0], [6, 75, 0], [10, 90, 0], [18, 110, 0], [30, 130, 0], [50, 160, 0], [80, 190, 0]],

    'N9': [[3, -4, -29], [6, -12, -42], [10, -15, -51], [18, -18, -61], [30, -22, -74], [50, -26, -88], [80, -32, -106]],
    'P9': [[3, -6, -31], [6, -12, -42], [10, -15, -51], [18, -18, -61], [30, -22, -74], [50, -26, -88], [80, -32, -106]],
    'JS7': [[3, 5, -5], [6, 6, -6], [10, 7.5, -7.5], [18, 9, -9], [30, 10.5, -10.5], [50, 12.5, -12.5], [80, 15, -15]],
    'K7': [[3, 0, -10], [6, 3, -9], [10, 5, -10], [18, 6, -12], [30, 6, -15], [50, 7, -18], [80, 9, -21]],

    'D10': [[3, 60, 20], [6, 78, 30], [10, 98, 40], [18, 120, 50], [30, 149, 65], [50, 180, 80], [80, 220, 100]],
    'E9': [[3, 39, 14], [6, 50, 20], [10, 61, 25], [18, 75, 32], [30, 92, 40], [50, 112, 50], [80, 134, 60]],
    'F8': [[3, 20, 6], [6, 28, 10], [10, 35, 13], [18, 43, 16], [30, 53, 20], [50, 64, 25], [80, 76, 30]],

    'h5': [[3, 0, -4], [6, 0, -5], [10, 0, -6], [18, 0, -8], [30, 0, -9], [50, 0, -11], [80, 0, -13]],
    'h6': [[3, 0, -6], [6, 0, -8], [10, 0, -9], [18, 0, -11], [30, 0, -13], [50, 0, -16], [80, 0, -19]],
    'h7': [[3, 0, -10], [6, 0, -12], [10, 0, -15], [18, 0, -18], [30, 0, -21], [50, 0, -25], [80, 0, -30]],
    'g5': [[3, -2, -6], [6, -4, -9], [10, -5, -11], [18, -6, -14], [30, -7, -16], [50, -9, -20], [80, -10, -23]],
    'g6': [[3, -2, -8], [6, -4, -12], [10, -5, -14], [18, -6, -17], [30, -7, -20], [50, -9, -25], [80, -10, -29]],

    'k6': [[3, 6, 0], [6, 9, 1], [10, 10, 1], [18, 12, 1], [30, 15, 2], [50, 18, 2], [80, 21, 2]],
    'm6': [[3, 8, 2], [6, 12, 4], [10, 15, 6], [18, 17, 7], [30, 21, 8], [50, 25, 9], [80, 30, 11]],
    'n6': [[3, 10, 4], [6, 16, 8], [10, 19, 10], [18, 23, 12], [30, 28, 15], [50, 33, 17], [80, 39, 20]],
    'p6': [[3, 12, 6], [6, 20, 12], [10, 24, 15], [18, 29, 18], [30, 35, 22], [50, 42, 26], [80, 51, 32]],
    'r6': [[3, 16, 10], [6, 23, 15], [10, 28, 19], [18, 34, 23], [30, 41, 28], [50, 50, 34], [80, 62, 43]],
    's6': [[3, 20, 14], [6, 27, 19], [10, 32, 23], [18, 39, 28], [30, 48, 35], [50, 59, 43], [80, 72, 53]],

    'js5': [[3, 2, -2], [6, 2.5, -2.5], [10, 3, -3], [18, 4, -4], [30, 4.5, -4.5], [50, 5.5, -5.5], [80, 6.5, -6.5]],
    'js6': [[3, 3, -3], [6, 4, -4], [10, 4.5, -4.5], [18, 5.5, -5.5], [30, 6.5, -6.5], [50, 8, -8], [80, 9.5, -9.5]],
    'f7': [[3, -6, -16], [6, -10, -22], [10, -13, -28], [18, -16, -34], [30, -20, -41], [50, -25, -50], [80, -30, -60]]
};

function setTol(tol, type, btn) {
    document.getElementById('selected-tol').value = tol;
    document.getElementById('selected-type').value = type;
    document.querySelectorAll('.tol-btn').forEach(b => {
        b.classList.remove('bg-red-600', 'border-transparent', 'ring-2', 'ring-white');
        b.classList.add('bg-slate-700', 'border-slate-600');
    });
    btn.classList.remove('bg-slate-700', 'border-slate-600');
    btn.classList.add('bg-red-600', 'border-transparent', 'ring-2', 'ring-white');
    calculateISO();
}
function calculateISO() {
    const dim = parseFloat(document.getElementById('iso-dim').value);
    const tolClass = document.getElementById('selected-tol').value;
    const resultsPanel = document.getElementById('iso-results-panel');
    if (!dim || dim > 80 || !tolClass) { resultsPanel.classList.add('hidden'); return; } // Limit 80 for expanded set
    const table = isoData[tolClass];
    let range = null; let prevMax = 0;
    for (let r of table) { if (dim > prevMax && dim <= r[0]) { range = r; break; } prevMax = r[0]; }
    if (range) {
        resultsPanel.classList.remove('hidden');
        const es = range[1] / 1000; const ei = range[2] / 1000;
        document.getElementById('iso-class-display').innerText = tolClass;
        document.getElementById('iso-range-display').innerText = `${prevMax}-${range[0]}mm`;
        document.getElementById('iso-upper').innerText = (es >= 0 ? "+" : "") + es.toFixed(3);
        document.getElementById('iso-lower').innerText = (ei >= 0 ? "+" : "") + ei.toFixed(3);
        document.getElementById('iso-max-dim').innerText = (dim + es).toFixed(3);
        document.getElementById('iso-min-dim').innerText = (dim + ei).toFixed(3);
    } else { resultsPanel.classList.add('hidden'); }
}

// --- RESTORED LOGIC (Missing functions) ---

// 1. Feeds
function transferToCalc() {
    const vhmText = document.getElementById('lib-vc-vhm').innerText;
    if (vhmText && vhmText.includes('-')) {
        const parts = vhmText.split('-');
        const avg = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
        document.getElementById('sf-vc').value = Math.round(avg);
    }
    switchTab('tab-feeds');
}

function calculateSF() {
    const D = parseFloat(document.getElementById('sf-d').value);
    const Vc = parseFloat(document.getElementById('sf-vc').value);
    const Z = parseFloat(document.getElementById('sf-z').value);
    const fz = parseFloat(document.getElementById('sf-fz').value);

    if (!D || !Vc) return;

    const rpm = Math.round((Vc * 1000) / (Math.PI * D));
    document.getElementById('res-rpm').innerText = rpm;

    if (Z && fz) {
        const feed = Math.round(rpm * Z * fz);
        document.getElementById('res-feed').innerText = feed;
        const fn = (feed / rpm).toFixed(3);
        document.getElementById('res-fn').innerText = fn;
    }
}

// 2. MRR
function calculateMRR() {
    const ap = parseFloat(document.getElementById('mrr-ap').value);
    const ae = parseFloat(document.getElementById('mrr-ae').value);
    const f = parseFloat(document.getElementById('mrr-f').value);

    if (ap && ae && f) {
        const mrr = (ap * ae * f) / 1000;
        document.getElementById('res-mrr').innerText = mrr.toFixed(1);
    }
}

// 3. Geometry (Drill & Chamfer)
function calcDrillTip() {
    const d = parseFloat(document.getElementById('geo-drill-d').value);
    const angle = parseFloat(document.getElementById('geo-drill-angle').value);
    if (d && angle) {
        const rad = (angle / 2) * (Math.PI / 180);
        const tipLen = (d / 2) / Math.tan(rad);
        document.getElementById('geo-drill-res').innerText = tipLen.toFixed(2);
    }
}

function calcChamfer() {
    const dTarget = parseFloat(document.getElementById('geo-chamfer-d').value);
    const dTip = parseFloat(document.getElementById('geo-chamfer-tip').value) || 0;
    if (dTarget) {
        const z = (dTarget - dTip) / 2;
        document.getElementById('geo-chamfer-res').innerText = z.toFixed(2);
    }
}

// 4. Threads & G84
function updateThreadInfo() {
    const val = document.getElementById('thread-select').value;
    if (val === "0") {
        document.getElementById('th-drill').innerText = "-";
        return;
    }
    const [size, pitch] = val.split(':');
    const drill = (parseFloat(size) - parseFloat(pitch)).toFixed(2);
    document.getElementById('th-drill').innerText = drill + " mm";
    document.getElementById('tap-pitch').value = pitch;
}

function calcTapping() {
    const P = parseFloat(document.getElementById('tap-pitch').value);
    const rpm = parseFloat(document.getElementById('tap-rpm').value);
    if (P && rpm) {
        const feed = (P * rpm).toFixed(0);
        document.getElementById('tap-feed-res').innerText = feed + " mm/min";
    }
}

// 5. Screws
const screwData = {
    'M3': { dk: 5.5, k: 3, cbDia: 6, cbDep: 3.5 },
    'M4': { dk: 7, k: 4, cbDia: 8, cbDep: 4.5 },
    'M5': { dk: 8.5, k: 5, cbDia: 10, cbDep: 5.5 },
    'M6': { dk: 10, k: 6, cbDia: 11, cbDep: 6.5 },
    'M8': { dk: 13, k: 8, cbDia: 15, cbDep: 9 },
    'M10': { dk: 16, k: 10, cbDia: 18, cbDep: 11 },
    'M12': { dk: 18, k: 12, cbDia: 20, cbDep: 13 },
    'M16': { dk: 24, k: 16, cbDia: 26, cbDep: 17.5 },
    'M20': { dk: 30, k: 20, cbDia: 33, cbDep: 21.5 },
};

function updateScrewInfo() {
    const val = document.getElementById('screw-select').value;
    if (val === '0') return;
    const data = screwData[val];
    document.getElementById('sc-head-dia').innerText = data.dk;
    document.getElementById('sc-head-h').innerText = data.k;
    document.getElementById('sc-cb-dia').innerText = data.cbDia;
    document.getElementById('sc-cb-depth').innerText = data.cbDep;
}

// 6. Weight Calc
let currentShape = 'round';
function setShape(shape) {
    currentShape = shape;
    document.querySelectorAll('.shape-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-600');
        if (b.getAttribute('data-shape') === shape) {
            b.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-600');
            b.classList.add('active');
        }
    });
    document.querySelectorAll('.shape-inputs').forEach(div => div.classList.add('hidden'));
    document.getElementById(`inputs-${shape}`).classList.remove('hidden');
}

function updateDensity() {
    const val = document.getElementById('weight-mat').value;
    const customInput = document.getElementById('weight-density');
    if (val === 'custom') {
        customInput.classList.remove('hidden');
    } else {
        customInput.classList.add('hidden');
        customInput.value = val;
    }
}

function calculateWeight() {
    const density = parseFloat(document.getElementById('weight-density').value); // g/cm3
    if (!density) return;

    let volumeCm3 = 0;

    if (currentShape === 'round') {
        const d = parseFloat(document.getElementById('w-d').value) / 10; // to cm
        const l = parseFloat(document.getElementById('w-l-round').value) / 10; // to cm
        if (d && l) volumeCm3 = Math.PI * Math.pow(d / 2, 2) * l;
    } else if (currentShape === 'rect') {
        const w = parseFloat(document.getElementById('w-w').value) / 10;
        const h = parseFloat(document.getElementById('w-h').value) / 10;
        const l = parseFloat(document.getElementById('w-l-rect').value) / 10;
        if (w && h && l) volumeCm3 = w * h * l;
    } else if (currentShape === 'tube') {
        const od = parseFloat(document.getElementById('w-od').value) / 10;
        const t = parseFloat(document.getElementById('w-wall').value) / 10;
        const l = parseFloat(document.getElementById('w-l-tube').value) / 10;
        if (od && t && l) {
            const id = od - (2 * t);
            if (id > 0) volumeCm3 = (Math.PI * Math.pow(od / 2, 2) * l) - (Math.PI * Math.pow(id / 2, 2) * l);
        }
    }

    const weightG = volumeCm3 * density;
    const weightKg = weightG / 1000;

    document.getElementById('weight-res-kg').innerText = weightKg.toFixed(2);
    document.getElementById('weight-res-g').innerText = Math.round(weightG) + ' g';
}

// 7. Converter
function convLength(source) {
    const mmInput = document.getElementById('conv-mm');
    const inInput = document.getElementById('conv-inch');

    if (source === 'mm') {
        const mm = parseFloat(mmInput.value);
        if (!isNaN(mm)) inInput.value = (mm / 25.4).toFixed(4);
        else inInput.value = "";
    } else {
        const inch = parseFloat(inInput.value);
        if (!isNaN(inch)) mmInput.value = (inch * 25.4).toFixed(3);
        else mmInput.value = "";
    }
}

function convSpeed(source) {
    const mInput = document.getElementById('conv-mmin');
    const ftInput = document.getElementById('conv-ftmin');

    if (source === 'm') {
        const m = parseFloat(mInput.value);
        if (!isNaN(m)) ftInput.value = (m * 3.28084).toFixed(1);
        else ftInput.value = "";
    } else {
        const ft = parseFloat(ftInput.value);
        if (!isNaN(ft)) mInput.value = (ft / 3.28084).toFixed(1);
        else mInput.value = "";
    }
}

// Initialize
updateLibrary();
