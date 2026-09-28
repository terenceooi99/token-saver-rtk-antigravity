// Acquire VS Code API
const vscode = acquireVsCodeApi();

// DOM Elements
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const popOutBtn = document.getElementById('popOutBtn');
const refreshBtn = document.getElementById('refreshBtn');

const totalSavedVal = document.getElementById('totalSavedVal');
const savedRatioVal = document.getElementById('savedRatioVal');
const efficiencyVal = document.getElementById('efficiencyVal');
const efficiencyBar = document.getElementById('efficiencyBar');
const costSavedVal = document.getElementById('costSavedVal');
const activeTargetsVal = document.getElementById('activeTargetsVal');
const skillsScopeVal = document.getElementById('skillsScopeVal');

const syncAllIdesBtn = document.getElementById('syncAllIdesBtn');
const ideGridContainer = document.getElementById('ideGridContainer');

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
const diagActiveTargets = document.getElementById('diagActiveTargets');

const IDE_ICONS = {
    antigravity_global: '🌌',
    antigravity_workspace: '🌌',
    copilot: '🤖',
    cursor: '🎯',
    windsurf: '🏄',
    cline: '💻',
    claude: '🧠',
    agents: '🌐'
};

// Event Listeners
toggleModeBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'toggleMode' });
});

if (popOutBtn) {
    popOutBtn.addEventListener('click', () => {
        vscode.postMessage({ command: 'popOut' });
    });
}

refreshBtn.addEventListener('click', () => {
    refreshBtn.style.transform = 'rotate(360deg)';
    vscode.postMessage({ command: 'refresh' });
    setTimeout(() => {
        refreshBtn.style.transform = 'none';
    }, 400);
});

syncAllIdesBtn.addEventListener('click', () => {
    syncAllIdesBtn.textContent = 'Syncing...';
    vscode.postMessage({ command: 'syncAllIdeRules' });
    setTimeout(() => {
        syncAllIdesBtn.textContent = '⚡ Sync All Targets';
    }, 800);
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
    const { isEnabled, installed, version, binaryPath, metrics, scope, ideStatus } = data;

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

    // IDE Targets Summary
    const syncedCount = (ideStatus || []).filter(i => i.synced).length;
    const totalTargets = (ideStatus || []).length;
    activeTargetsVal.textContent = `${syncedCount} / ${totalTargets} Synced`;
    activeTargetsVal.style.color = syncedCount > 0 ? 'var(--accent-green)' : 'var(--accent-amber)';
    skillsScopeVal.textContent = scope === 'all' ? 'Universal (All AI Agents)' : `Scope: ${scope}`;

    // Render Multi-IDE Grid
    renderIdeGrid(ideStatus || []);

    // Command Breakdown Chart
    renderChart(metrics.commandBreakdown);

    // Raw Output text snippet
    rawOutputText.textContent = metrics.rawText || 'No output recorded yet.';

    // Diagnostics
    diagCliStatus.textContent = installed ? 'Detected & Ready' : 'Not Installed';
    diagCliStatus.style.color = installed ? 'var(--accent-green)' : 'var(--accent-rose)';
    diagVersion.textContent = version;
    diagBinaryPath.textContent = binaryPath;
    diagScope.textContent = scope === 'all' ? 'All Supported IDEs & Agents' : scope;
    diagActiveTargets.textContent = `${syncedCount} IDE Targets Active`;
}

function renderIdeGrid(ideList) {
    ideGridContainer.innerHTML = '';

    if (!ideList || ideList.length === 0) {
        ideGridContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; grid-column: 1/-1;">No IDE targets available.</div>';
        return;
    }

    ideList.forEach(ide => {
        const card = document.createElement('div');
        card.className = 'ide-card';

        const top = document.createElement('div');
        top.className = 'ide-card-top';

        const iconTitle = document.createElement('div');
        iconTitle.className = 'ide-icon-title';

        const icon = document.createElement('span');
        icon.className = 'ide-card-icon';
        icon.textContent = IDE_ICONS[ide.id] || '🤖';

        const textDiv = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'ide-card-name';
        name.textContent = ide.name;

        const pathDiv = document.createElement('div');
        pathDiv.className = 'ide-card-path';
        const displayPath = ide.path.length > 35 ? '...' + ide.path.slice(-32) : ide.path;
        pathDiv.textContent = displayPath;
        pathDiv.title = ide.path;

        textDiv.appendChild(name);
        textDiv.appendChild(pathDiv);
        iconTitle.appendChild(icon);
        iconTitle.appendChild(textDiv);

        const statusTag = document.createElement('span');
        statusTag.className = `ide-status-tag ${ide.synced ? 'synced' : 'inactive'}`;
        statusTag.textContent = ide.synced ? 'SYNCED' : 'OFF';

        top.appendChild(iconTitle);
        top.appendChild(statusTag);

        const actions = document.createElement('div');
        actions.className = 'ide-card-actions';

        const syncBtn = document.createElement('button');
        syncBtn.className = 'btn-ide-sync';
        syncBtn.textContent = ide.synced ? '🔄 Re-Sync Rule' : '⚡ Enable Rule';
        syncBtn.addEventListener('click', () => {
            vscode.postMessage({
                command: 'syncSingleTarget',
                targetId: ide.id
            });
        });

        actions.appendChild(syncBtn);

        card.appendChild(top);
        card.appendChild(actions);
        ideGridContainer.appendChild(card);
    });
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
