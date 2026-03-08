/**
 * =============================================
 *   BANKER'S ALGORITHM SIMULATOR — SCRIPT.JS
 *   Full Deadlock Avoidance Implementation
 * =============================================
 */

// ─── STATE ────────────────────────────────────
let numProcesses = 0;
let numResources = 0;
let allocationMatrix = [];
let maximumMatrix = [];
let availableVector = [];
let needMatrix = [];
let isDarkTheme = true;

// ─── DOM REFERENCES ───────────────────────────
const numProcessesInput = document.getElementById('numProcesses');
const numResourcesInput = document.getElementById('numResources');
const generateBtn = document.getElementById('generateBtn');
const randomBtn = document.getElementById('randomBtn');
const runBtn = document.getElementById('runBtn');
const resetBtn = document.getElementById('resetBtn');
const matrixInputCard = document.getElementById('matrixInputCard');
const welcomeCard = document.getElementById('welcomeCard');
const resultsArea = document.getElementById('resultsArea');
const globalStatus = document.getElementById('globalStatus');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  bindEvents();
});

// ─── PARTICLES ────────────────────────────────
function createParticles() {
  const container = document.getElementById('bgParticles');
  const colors = ['#a78bfa', '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#22d3ee'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      --dur: ${Math.random() * 12 + 8}s;
      --delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// ─── EVENTS ───────────────────────────────────
function bindEvents() {
  generateBtn.addEventListener('click', handleGenerate);
  randomBtn.addEventListener('click', handleRandom);
  runBtn.addEventListener('click', handleRun);
  resetBtn.addEventListener('click', handleReset);
  themeToggle.addEventListener('click', toggleTheme);
}

// ─── THEME TOGGLE ─────────────────────────────
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle('light', !isDarkTheme);
  if (isDarkTheme) {
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  } else {
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
  showToast('info', '🎨', isDarkTheme ? 'Switched to Dark Mode' : 'Switched to Light Mode');
}

// ─── GENERATE TABLES ──────────────────────────
function handleGenerate() {
  numProcesses = parseInt(numProcessesInput.value);
  numResources = parseInt(numResourcesInput.value);

  if (isNaN(numProcesses) || numProcesses < 1 || numProcesses > 10) {
    showToast('error', '⚠️', 'Processes must be between 1 and 10');
    return;
  }
  if (isNaN(numResources) || numResources < 1 || numResources > 8) {
    showToast('error', '⚠️', 'Resource types must be between 1 and 8');
    return;
  }

  buildMatrixUI();
  matrixInputCard.style.display = 'block';
  matrixInputCard.classList.add('fade-in');
  showToast('info', '📋', `Generated tables for ${numProcesses} processes & ${numResources} resources`);
}

// ─── BUILD MATRIX UI ──────────────────────────
function buildMatrixUI() {
  buildAvailableUI();
  buildAllocationUI();
  buildMaxUI();
}

function buildAvailableUI() {
  const wrapper = document.getElementById('availableWrapper');
  const table = document.createElement('table');
  table.className = 'matrix-table';
  const thead = document.createElement('thead');
  const hRow = document.createElement('tr');
  hRow.innerHTML = '<th></th>';
  for (let j = 0; j < numResources; j++) {
    const th = document.createElement('th');
    th.textContent = `R${j}`;
    hRow.appendChild(th);
  }
  thead.appendChild(hRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const row = document.createElement('tr');
  const lbl = document.createElement('td');
  lbl.className = 'row-label';
  lbl.textContent = 'Available';
  row.appendChild(lbl);
  for (let j = 0; j < numResources; j++) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '99';
    input.value = '0';
    input.className = 'matrix-input';
    input.id = `avail_${j}`;
    input.setAttribute('data-matrix', 'available');
    input.setAttribute('data-col', j);
    td.appendChild(input);
    row.appendChild(td);
  }
  tbody.appendChild(row);
  table.appendChild(tbody);
  wrapper.innerHTML = '';
  wrapper.appendChild(table);
}

function buildAllocationUI() {
  buildProcessMatrix('allocation', 'allocationWrapper', 'Allocation');
}
function buildMaxUI() {
  buildProcessMatrix('max', 'maxWrapper', 'Max');
}

function buildProcessMatrix(matrixName, wrapperId, labelPrefix) {
  const wrapper = document.getElementById(wrapperId);
  const table = document.createElement('table');
  table.className = 'matrix-table';
  const thead = document.createElement('thead');
  const hRow = document.createElement('tr');
  hRow.innerHTML = '<th></th>';
  for (let j = 0; j < numResources; j++) {
    const th = document.createElement('th');
    th.textContent = `R${j}`;
    hRow.appendChild(th);
  }
  thead.appendChild(hRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = 0; i < numProcesses; i++) {
    const row = document.createElement('tr');
    const lbl = document.createElement('td');
    lbl.className = 'row-label';
    lbl.textContent = `P${i}`;
    row.appendChild(lbl);
    for (let j = 0; j < numResources; j++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '99';
      input.value = '0';
      input.className = 'matrix-input';
      input.id = `${matrixName}_${i}_${j}`;
      input.setAttribute('data-matrix', matrixName);
      input.setAttribute('data-row', i);
      input.setAttribute('data-col', j);
      td.appendChild(input);
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  wrapper.innerHTML = '';
  wrapper.appendChild(table);
}

// ─── RANDOM EXAMPLE ───────────────────────────
function handleRandom() {
  // Use classic Banker's Algorithm example
  const examples = [
    {
      processes: 5,
      resources: 3,
      allocation: [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]],
      max: [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]],
      available: [3,3,2]
    },
    {
      processes: 4,
      resources: 3,
      allocation: [[0,0,1],[1,0,0],[1,3,0],[0,1,1]],
      max: [[0,0,1],[1,7,5],[2,3,5],[0,6,5]],
      available: [1,5,2]
    },
    {
      processes: 3,
      resources: 4,
      allocation: [[0,0,1,2],[1,0,0,0],[1,3,5,4]],
      max: [[0,0,1,2],[1,7,5,0],[2,3,5,6]],
      available: [1,5,2,0]
    }
  ];
  const ex = examples[Math.floor(Math.random() * examples.length)];

  numProcessesInput.value = ex.processes;
  numResourcesInput.value = ex.resources;
  numProcesses = ex.processes;
  numResources = ex.resources;

  buildMatrixUI();
  matrixInputCard.style.display = 'block';
  matrixInputCard.classList.add('fade-in');

  // Fill values
  ex.available.forEach((v, j) => {
    const el = document.getElementById(`avail_${j}`);
    if (el) { el.value = v; el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 300); }
  });
  ex.allocation.forEach((row, i) => {
    row.forEach((v, j) => {
      const el = document.getElementById(`allocation_${i}_${j}`);
      if (el) { el.value = v; }
    });
  });
  ex.max.forEach((row, i) => {
    row.forEach((v, j) => {
      const el = document.getElementById(`max_${i}_${j}`);
      if (el) { el.value = v; }
    });
  });

  showToast('success', '🎲', 'Random example loaded! Click "Run Algorithm"');
}

// ─── READ MATRICES FROM UI ────────────────────
function readMatrices() {
  availableVector = [];
  allocationMatrix = [];
  maximumMatrix = [];

  for (let j = 0; j < numResources; j++) {
    const el = document.getElementById(`avail_${j}`);
    availableVector.push(parseInt(el?.value) || 0);
  }
  for (let i = 0; i < numProcesses; i++) {
    const allocRow = [];
    const maxRow = [];
    for (let j = 0; j < numResources; j++) {
      allocRow.push(parseInt(document.getElementById(`allocation_${i}_${j}`)?.value) || 0);
      maxRow.push(parseInt(document.getElementById(`max_${i}_${j}`)?.value) || 0);
    }
    allocationMatrix.push(allocRow);
    maximumMatrix.push(maxRow);
  }
}

// ─── CALCULATE NEED MATRIX ────────────────────
function calculateNeedMatrix() {
  needMatrix = [];
  for (let i = 0; i < numProcesses; i++) {
    const row = [];
    for (let j = 0; j < numResources; j++) {
      row.push(maximumMatrix[i][j] - allocationMatrix[i][j]);
    }
    needMatrix.push(row);
  }
}

// ─── VALIDATE ─────────────────────────────────
function validateInputs() {
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      if (allocationMatrix[i][j] < 0 || maximumMatrix[i][j] < 0) {
        return 'Values must be non-negative.';
      }
      if (allocationMatrix[i][j] > maximumMatrix[i][j]) {
        return `Allocation[P${i}][R${j}] exceeds Maximum. Allocation cannot exceed maximum claim.`;
      }
    }
  }
  for (let j = 0; j < numResources; j++) {
    if (availableVector[j] < 0) return 'Available resources cannot be negative.';
  }
  return null;
}

// ─── SAFETY ALGORITHM ─────────────────────────
function isSafeState() {
  const work = [...availableVector];
  const finish = new Array(numProcesses).fill(false);
  const safeSequence = [];
  const steps = [];

  steps.push({
    type: 'info',
    title: 'Initialization',
    detail: `Work = [${work.join(', ')}] | All Finish[] = false`
  });

  let found = true;
  while (safeSequence.length < numProcesses && found) {
    found = false;
    for (let i = 0; i < numProcesses; i++) {
      if (finish[i]) continue;

      const needMet = needMatrix[i].every((need, j) => need <= work[j]);

      if (needMet) {
        const oldWork = [...work];
        for (let j = 0; j < numResources; j++) {
          work[j] += allocationMatrix[i][j];
        }
        finish[i] = true;
        safeSequence.push(i);
        found = true;

        steps.push({
          type: 'success',
          title: `P${i} can proceed`,
          detail:
            `Need[P${i}] = [${needMatrix[i].join(', ')}] ≤ Work [${oldWork.join(', ')}]\n` +
            `Work ← Work + Alloc[P${i}] = [${oldWork.join(', ')}] + [${allocationMatrix[i].join(', ')}] = [${work.join(', ')}]\n` +
            `Finish[P${i}] = true | Safe so far: [${safeSequence.map(p => `P${p}`).join(' → ')}]`
        });
        break;
      } else {
        steps.push({
          type: 'fail',
          title: `P${i} cannot proceed (skipped)`,
          detail: `Need[P${i}] = [${needMatrix[i].join(', ')}] > Work [${work.join(', ')}] → waiting`
        });
      }
    }
  }

  const isSafe = safeSequence.length === numProcesses;
  steps.push({
    type: isSafe ? 'success' : 'fail',
    title: isSafe ? '✓ SAFE STATE DETECTED' : '✗ UNSAFE STATE — DEADLOCK POSSIBLE',
    detail: isSafe
      ? `All processes finished. Safe Sequence: ${safeSequence.map(p => `P${p}`).join(' → ')}`
      : `Only ${safeSequence.length}/${numProcesses} processes completed. System may deadlock.`
  });

  return { isSafe, safeSequence, steps };
}

// ─── GENERATE & DISPLAY ───────────────────────
function generateSafeSequence() {
  return isSafeState();
}

// ─── RUN HANDLER ──────────────────────────────
function handleRun() {
  if (!numProcesses || !numResources) {
    showToast('error', '⚠️', 'Please generate the tables first!');
    return;
  }

  readMatrices();
  const validErr = validateInputs();
  if (validErr) {
    showToast('error', '⚠️', validErr);
    return;
  }

  calculateNeedMatrix();
  const { isSafe, safeSequence, steps } = generateSafeSequence();

  updateStatus(isSafe ? 'safe' : 'unsafe', isSafe ? 'Safe State' : 'Unsafe State');

  welcomeCard.style.display = 'none';
  resultsArea.style.display = 'block';
  resultsArea.classList.add('fade-in');

  displayResult(isSafe, safeSequence);
  displayNeedMatrix();
  displaySteps(steps);
  if (isSafe) displayExecutionBar(safeSequence);

  const execBarCard = document.getElementById('execBarCard');
  execBarCard.style.display = isSafe ? 'block' : 'none';

  runBtn.classList.add('pulse');
  setTimeout(() => runBtn.classList.remove('pulse'), 700);

  showToast(
    isSafe ? 'success' : 'error',
    isSafe ? '✅' : '❌',
    isSafe ? `Safe! Sequence: ${safeSequence.map(p => `P${p}`).join('→')}` : 'Unsafe state! Deadlock possible.'
  );
}

// ─── DISPLAY RESULT ───────────────────────────
function displayResult(isSafe, safeSequence) {
  const stateIcon = document.getElementById('stateIcon');
  const stateLabel = document.getElementById('stateLabel');
  const stateDesc = document.getElementById('stateDesc');
  const seqSection = document.getElementById('sequenceSection');
  const seqVis = document.getElementById('sequenceVis');

  stateIcon.className = 'state-icon ' + (isSafe ? 'safe' : 'unsafe');
  stateIcon.textContent = isSafe ? '🛡️' : '💀';

  stateLabel.className = 'state-label ' + (isSafe ? 'safe' : 'unsafe');
  stateLabel.textContent = isSafe ? 'SAFE STATE' : 'UNSAFE STATE';

  stateDesc.textContent = isSafe
    ? `All ${numProcesses} processes can complete. No deadlock will occur.`
    : `System cannot guarantee all processes will complete. Deadlock potential detected.`;

  if (isSafe) {
    seqSection.style.display = 'block';
    seqVis.innerHTML = '';
    safeSequence.forEach((proc, idx) => {
      const node = document.createElement('div');
      node.className = 'seq-node';
      node.style.animationDelay = `${idx * 0.15}s`;
      node.innerHTML = `<div class="proc-chip">P${proc}</div>${idx < safeSequence.length - 1 ? '<span class="arrow">→</span>' : ''}`;
      seqVis.appendChild(node);
    });
  } else {
    seqSection.style.display = 'none';
  }
}

// ─── DISPLAY NEED MATRIX ──────────────────────
function displayNeedMatrix() {
  const area = document.getElementById('needMatrixDisplay');
  const table = document.createElement('table');
  table.className = 'display-table';

  // Header
  const thead = document.createElement('thead');
  const hRow = document.createElement('tr');
  hRow.innerHTML = '<th>Process</th>';
  for (let j = 0; j < numResources; j++) {
    hRow.innerHTML += `<th>R${j}</th>`;
  }
  thead.appendChild(hRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  needMatrix.forEach((row, i) => {
    const tr = document.createElement('tr');
    const procTd = document.createElement('td');
    procTd.className = 'proc-col';
    procTd.textContent = `P${i}`;
    tr.appendChild(procTd);
    row.forEach((val, j) => {
      const td = document.createElement('td');
      td.textContent = val;
      td.style.animationDelay = `${(i * numResources + j) * 0.04}s`;
      if (val === 0) td.classList.add('need-cell-zero');
      else if (val > 3) td.classList.add('need-cell-high');
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  area.innerHTML = '';
  area.appendChild(table);
}

// ─── DISPLAY STEPS ────────────────────────────
function displaySteps(steps) {
  const container = document.getElementById('stepsContainer');
  container.innerHTML = '';
  steps.forEach((step, idx) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.style.animationDelay = `${idx * 0.08}s`;

    const badge = document.createElement('div');
    badge.className = `step-badge ${step.type}`;
    badge.textContent = idx + 1;

    const content = document.createElement('div');
    content.className = 'step-content';

    const title = document.createElement('div');
    title.className = 'step-title';
    title.textContent = step.title;

    const detail = document.createElement('div');
    detail.className = 'step-detail';
    // Highlight brackets content
    detail.innerHTML = step.detail.replace(/\[([^\]]+)\]/g, '<span>[$1]</span>');

    content.appendChild(title);
    content.appendChild(detail);
    item.appendChild(badge);
    item.appendChild(content);
    container.appendChild(item);
  });
}

// ─── EXECUTION BAR ────────────────────────────
function displayExecutionBar(safeSequence) {
  const container = document.getElementById('execBarContainer');
  container.innerHTML = '';

  safeSequence.forEach((proc, idx) => {
    const row = document.createElement('div');
    row.className = 'exec-bar-row';
    row.style.animationDelay = `${idx * 0.12}s`;

    const label = document.createElement('div');
    label.className = 'exec-proc-label';
    label.textContent = `P${proc}`;

    const track = document.createElement('div');
    track.className = 'exec-bar-track';

    const fill = document.createElement('div');
    fill.className = 'exec-bar-fill seq';
    fill.style.animationDelay = `${idx * 0.15}s`;
    fill.style.animationDuration = `${0.6 + idx * 0.1}s`;

    track.appendChild(fill);

    const orderNum = document.createElement('div');
    orderNum.className = 'exec-order-num';
    orderNum.textContent = `#${idx + 1}`;

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(orderNum);
    container.appendChild(row);
  });
}

// ─── STATUS UPDATE ────────────────────────────
function updateStatus(type, text) {
  const dot = globalStatus.querySelector('.status-dot');
  const span = globalStatus.querySelectorAll('span')[1];
  dot.className = 'status-dot ' + type;
  span.textContent = text;
}

// ─── RESET ────────────────────────────────────
function handleReset() {
  numProcesses = 0;
  numResources = 0;
  allocationMatrix = [];
  maximumMatrix = [];
  availableVector = [];
  needMatrix = [];

  numProcessesInput.value = '5';
  numResourcesInput.value = '3';

  matrixInputCard.style.display = 'none';
  document.getElementById('allocationWrapper').innerHTML = '';
  document.getElementById('maxWrapper').innerHTML = '';
  document.getElementById('availableWrapper').innerHTML = '';

  welcomeCard.style.display = 'flex';
  resultsArea.style.display = 'none';

  updateStatus('idle', 'Ready');
  showToast('info', '🔄', 'Simulator reset. Configure and run again!');
}

// ─── TOAST ────────────────────────────────────
function showToast(type, icon, message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => container.removeChild(toast), 350);
  }, 3500);
}
