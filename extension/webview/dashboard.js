// Acquire VS Code API
const vscode = acquireVsCodeApi();

// DOM Elements
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const refreshBtn = document.getElementById('refreshBtn');

const totalSavedVal = document.getElementById('totalSavedVal');
const savedRatioVal = document.getElementById('savedRatioVal');
const efficiencyVal = document.getElementById('efficiencyVal');
const efficiencyBar = document.getElementById('efficiencyBar');
const costSavedVal = document.getElementById('costSavedVal');
const skillsStatusVal = document.getElementById('skillsStatusVal');
const skillsScopeVal = document.getElementById('skillsScopeVal');

const chartContainer = document.getElementById('chartContainer');
const rawOutputText = document.getElementById('rawOutputText');

const syncSkillsBtn = document.getElementById('syncSkillsBtn');
const checkUpdatesBtn = document.getElementById('checkUpdatesBtn');
const openTerminalBtn = document.getElementById('openTerminalBtn');
const testLatencyBtn = document.getElementById('testLatencyBtn');
const latencySubText = document.getElementById('latencySubText');

const diagCliStatus = document.getElementById('diagCliStatus');
const diagVersion = document.getElementById('diagVersion');
const diagBinaryPath = document.getElementById('diagBinaryPath');
const diagScope = document.getElementById('diagScope');

// Event Listeners
toggleModeBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'toggleMode' });
});

refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'rotate(360deg)';
    vscode.postMessage({ command: 'refresh' });
    setTimeout(() => {
        refreshBtn.style.transform = 'none';
    }, 400);
});

syncSkillsBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'installSkills' });
});

checkUpdatesBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'checkUpdates' });
});

openTerminalBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'openScoreboardTerminal' });
});

testLatencyBtn.addEventListener('click', () => {
    latencySubText.textContent = 'Measuring latency...';
    vscode.postMessage({ command: 'testLatency' });
});

// Handle incoming messages from extension host
window.addEventListener('message', (event) => {
    const message = event.data;

    switch (message.type) {
        case 'stateUpdate':
            renderDashboardState(message.data);
            break;
        case 'latencyResult':
            if (message.data.available) {
                latencySubText.textContent = `Latency: ${message.data.latency} (Zero overhead)`;
            } else {
                latencySubText.textContent = 'RTK binary not reachable';
            }
            break;
        case 'updateCheckResult':
            if (message.data.hasUpdate) {
                checkUpdatesBtn.querySelector('.btn-label').textContent = `Update to ${message.data.release.tag}!`;
                checkUpdatesBtn.querySelector('.btn-sub').textContent = 'Click to upgrade now';
            }
            break;
    }
});

function renderDashboardState(data) {
    const { isEnabled, installed, version, binaryPath, metrics, skillsInstalled, scope } = data;

    // Status Pill
    if (isEnabled) {
        statusPill.className = 'status-pill active';
        statusText.textContent = 'RTK ACTIVE';
        toggleModeBtn.textContent = 'Turn RTK OFF';
        toggleModeBtn.className = 'btn btn-ghost';
    } else {
        statusPill.className = 'status-pill inactive';
        statusText.textContent = 'RTK INACTIVE';
        toggleModeBtn.textContent = 'Turn RTK ON';
        toggleModeBtn.className = 'btn btn-primary';
    }

    // Top Metric Cards
    totalSavedVal.textContent = metrics.totalSavedFormatted || '0';
    savedRatioVal.textContent = metrics.isMock 
        ? 'Awaiting command executions' 
        : `Active compression across ${metrics.commandBreakdown.length} tool categories`;

    const pct = metrics.savedPercentage || 0;
    efficiencyVal.textContent = `${pct}%`;
    efficiencyBar.style.width = `${Math.min(pct, 100)}%`;

    costSavedVal.textContent = metrics.estimatedDollarSavings || '$0.00';

    skillsStatusVal.textContent = skillsInstalled ? 'Active & Synced' : 'Not Installed';
    skillsStatusVal.style.color = skillsInstalled ? 'var(--accent-green)' : 'var(--accent-amber)';
    skillsScopeVal.textContent = `Scope: ${scope === 'global' ? 'Global (~/.gemini)' : 'Workspace (.agents)'}`;

    // Command Breakdown Chart
    renderChart(metrics.commandBreakdown);

    // Raw Output text snippet
    rawOutputText.textContent = metrics.rawText || 'No output recorded yet.';

    // Diagnostics
    diagCliStatus.textContent = installed ? 'Detected & Ready' : 'Not Installed';
    diagCliStatus.style.color = installed ? 'var(--accent-green)' : 'var(--accent-rose)';
    diagVersion.textContent = version;
    diagBinaryPath.textContent = binaryPath;
    diagScope.textContent = scope === 'global' ? 'Global (~/.gemini/config)' : 'Workspace (.agents)';
}

function renderChart(breakdown) {
    chartContainer.innerHTML = '';

    if (!breakdown || breakdown.length === 0) {
        chartContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px;">Run commands in your terminal with RTK to see per-tool compression stats here!</div>';
        return;
    }

    breakdown.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'chart-bar-row';

        const info = document.createElement('div');
        info.className = 'chart-bar-info';

        const cmdName = document.createElement('span');
        cmdName.className = 'chart-bar-cmd';
        cmdName.textContent = item.command;

        const stats = document.createElement('span');
        stats.className = 'chart-bar-stats';
        stats.textContent = `${item.savedFormatted || (item.savedTokens + ' tokens')} (${item.percentage}%)`;

        info.appendChild(cmdName);
        info.appendChild(stats);

        const track = document.createElement('div');
        track.className = 'chart-bar-track';

        const fill = document.createElement('div');
        fill.className = 'chart-bar-fill';
        fill.style.width = `${Math.max(item.percentage, 5)}%`;

        track.appendChild(fill);
        row.appendChild(info);
        row.appendChild(track);

        chartContainer.appendChild(row);
    });
}

// Initial signal to host
vscode.postMessage({ command: 'ready' });
