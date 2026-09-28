// Acquire VS Code API
const vscode = acquireVsCodeApi();

// DOM Elements
const dashboardContainer = document.getElementById('dashboardContainer');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const popOutBtn = document.getElementById('popOutBtn');
const minimizeBtn = document.getElementById('minimizeBtn');

const refreshBtn = document.getElementById('refreshBtn');
const refreshIcon = document.getElementById('refreshIcon');
const refreshMenuBtn = document.getElementById('refreshMenuBtn');
const refreshDropdownMenu = document.getElementById('refreshDropdownMenu');
const refreshTimerBadge = document.getElementById('refreshTimerBadge');
const customMinuteInput = document.getElementById('customMinuteInput');
const applyMinuteBtn = document.getElementById('applyMinuteBtn');

const totalSavedVal = document.getElementById('totalSavedVal');
const savedRatioVal = document.getElementById('savedRatioVal');
const efficiencyVal = document.getElementById('efficiencyVal');
const efficiencyBar = document.getElementById('efficiencyBar');
const costSavedVal = document.getElementById('costSavedVal');
const activeTargetsVal = document.getElementById('activeTargetsVal');
const skillsScopeVal = document.getElementById('skillsScopeVal');

const syncAllIdesBtn = document.getElementById('syncAllIdesBtn');
const ideGridContainer = document.getElementById('ideGridContainer');
const ideSyncTitle = document.getElementById('ideSyncTitle');
const ideSyncSubtitle = document.getElementById('ideSyncSubtitle');

const chartContainer = document.getElementById('chartContainer');
const rawOutputText = document.getElementById('rawOutputText');

const syncSkillsBtn = document.getElementById('syncSkillsBtn');
const skillsStatusBadge = document.getElementById('skillsStatusBadge');
const skillsSubText = document.getElementById('skillsSubText');

const checkUpdatesBtn = document.getElementById('checkUpdatesBtn');
const checkUpdatesLabel = document.getElementById('checkUpdatesLabel');
const checkUpdatesSub = document.getElementById('checkUpdatesSub');
const weeklySyncCheckbox = document.getElementById('weeklySyncCheckbox');
const weeklySyncWrapper = document.getElementById('weeklySyncWrapper');

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

// State variables
let isSidebarMode = false;
let isCompact = false;
let autoRefreshMinutes = 0; // in minutes, 0 = off
let autoRefreshTimer = null;

// Restore saved state
const savedState = vscode.getState() || {};
if (savedState.isCompact) {
    isCompact = true;
    dashboardContainer.classList.add('is-compact');
}
if (savedState.collapsedSections && Array.isArray(savedState.collapsedSections)) {
    savedState.collapsedSections.forEach(sectionId => {
        const sec = document.getElementById(sectionId);
        if (sec) sec.classList.add('collapsed');
    });
}
if (typeof savedState.autoRefreshMinutes === 'number') {
    setAutoRefresh(savedState.autoRefreshMinutes, false);
} else if (typeof savedState.autoRefreshInterval === 'number') {
    setAutoRefresh(savedState.autoRefreshInterval / 60, false);
}

function persistState() {
    const collapsed = [];
    document.querySelectorAll('.panel-card.collapsed').forEach(card => {
        if (card.id) collapsed.push(card.id);
    });
    vscode.setState({
        isCompact,
        collapsedSections: collapsed,
        autoRefreshMinutes
    });
}

// Auto-Refresh Logic (in Minutes)
function formatIntervalBadge(minutes) {
    if (minutes >= 60) {
        const hours = minutes / 60;
        return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
    }
    if (minutes < 1) {
        return `${Math.round(minutes * 60)}s`;
    }
    return `${minutes}m`;
}

function setAutoRefresh(minutes, shouldPersist = true) {
    if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
    }

    autoRefreshMinutes = minutes;

    // Update custom minute input field
    if (customMinuteInput) {
        customMinuteInput.value = minutes > 0 ? minutes : '';
    }

    // Update Dropdown Preset Items UI
    const items = refreshDropdownMenu.querySelectorAll('.dropdown-menu-item');
    items.forEach(item => {
        const itemMinutes = parseFloat(item.getAttribute('data-minutes'));
        const check = item.querySelector('.menu-item-check');
        if (itemMinutes === minutes) {
            item.classList.add('active');
            if (check) check.textContent = '✓';
        } else {
            item.classList.remove('active');
            if (check) check.textContent = '';
        }
    });

    if (minutes > 0) {
        refreshTimerBadge.textContent = formatIntervalBadge(minutes);
        refreshTimerBadge.style.display = 'inline-block';
        refreshBtn.title = `Auto-refreshing every ${formatIntervalBadge(minutes)} (Click to refresh now)`;

        autoRefreshTimer = setInterval(() => {
            triggerRefresh(true);
        }, minutes * 60 * 1000);
    } else {
        refreshTimerBadge.style.display = 'none';
        refreshBtn.title = 'Click to Refresh Metrics';
    }

    if (shouldPersist) {
        persistState();
    }
}

function applyCustomMinutes() {
    if (!customMinuteInput) return;
    const rawVal = customMinuteInput.value.trim();
    if (rawVal === '' || rawVal === '0') {
        setAutoRefresh(0, true);
        refreshDropdownMenu.classList.remove('show');
        return;
    }
    const val = parseFloat(rawVal);
    if (!isNaN(val) && val > 0) {
        setAutoRefresh(val, true);
        refreshDropdownMenu.classList.remove('show');
    }
}

function triggerRefresh(isAutomatic = false) {
    if (refreshIcon) {
        refreshIcon.classList.add('spinning');
        setTimeout(() => {
            refreshIcon.classList.remove('spinning');
        }, 600);
    }
    vscode.postMessage({ command: 'refresh', isAutomatic });
}

// Refresh Dropdown Event Listeners
refreshBtn.addEventListener('click', () => {
    triggerRefresh(false);
});

refreshMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    refreshDropdownMenu.classList.toggle('show');
    if (refreshDropdownMenu.classList.contains('show') && customMinuteInput) {
        customMinuteInput.focus();
    }
});

if (applyMinuteBtn) {
    applyMinuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyCustomMinutes();
    });
}

if (customMinuteInput) {
    customMinuteInput.addEventListener('click', (e) => e.stopPropagation());
    customMinuteInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            applyCustomMinutes();
        }
    });
}

// Dropdown item selection
refreshDropdownMenu.querySelectorAll('.dropdown-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const minutes = parseFloat(item.getAttribute('data-minutes'));
        setAutoRefresh(minutes, true);
        refreshDropdownMenu.classList.remove('show');
    });
});

// Close dropdown on outside click or Escape
window.addEventListener('click', (e) => {
    if (!refreshDropdownMenu.contains(e.target) && !refreshMenuBtn.contains(e.target)) {
        refreshDropdownMenu.classList.remove('show');
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        refreshDropdownMenu.classList.remove('show');
    }
});

// Minimize & Pop Out Event Listeners
if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
        if (!isSidebarMode) {
            // In editor panel: minimize/dock back to sidebar
            vscode.postMessage({ command: 'minimize' });
        } else {
            // In sidebar: toggle compact mode
            isCompact = !isCompact;
            dashboardContainer.classList.toggle('is-compact', isCompact);
            minimizeBtn.classList.toggle('active', isCompact);
            minimizeBtn.title = isCompact ? "Expand Full View" : "Minimize / Compact View";
            minimizeBtn.innerHTML = isCompact ? "🗖" : "🗕";
            persistState();
        }
    });
}

if (popOutBtn) {
    popOutBtn.addEventListener('click', () => {
        if (!isSidebarMode) {
            // In editor panel: dock to sidebar
            vscode.postMessage({ command: 'minimize' });
        } else {
            // In sidebar: pop out to editor tab
            vscode.postMessage({ command: 'popOut' });
        }
    });
}

// Collapsible Panels Event Listeners
document.querySelectorAll('.panel-header.collapsible').forEach(header => {
    header.addEventListener('click', (e) => {
        // Prevent collapsing if clicking a button inside header (e.g. syncAllIdesBtn)
        if (e.target.closest('button')) {
            return;
        }
        const parentCard = header.closest('.panel-card');
        if (parentCard) {
            parentCard.classList.toggle('collapsed');
            persistState();
        }
    });
});

// General Action Event Listeners
toggleModeBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'toggleMode' });
});

syncAllIdesBtn.addEventListener('click', () => {
    syncAllIdesBtn.textContent = 'Syncing...';
    vscode.postMessage({ command: 'syncAllIdeRules' });
    setTimeout(() => {
        syncAllIdesBtn.textContent = '⚡ Sync All';
    }, 800);
});

syncSkillsBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'installSkills' });
});

checkUpdatesBtn.addEventListener('click', () => {
    vscode.postMessage({ command: 'checkUpdates' });
});

if (weeklySyncCheckbox) {
    weeklySyncCheckbox.addEventListener('change', (e) => {
        vscode.postMessage({
            command: 'toggleWeeklyAutoSync',
            enabled: e.target.checked
        });
    });
}

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
            if (message.data && message.data.hasUpdate && message.data.release) {
                if (checkUpdatesLabel) {
                    checkUpdatesLabel.textContent = `Update to ${message.data.release.tag}!`;
                }
                if (checkUpdatesSub) {
                    checkUpdatesSub.textContent = 'Click to upgrade now';
                }
            }
            break;
    }
});

function renderDashboardState(data) {
    const { isEnabled, installed, version, binaryPath, metrics, scope, ideStatus, isSidebar } = data;

    isSidebarMode = !!isSidebar;
    dashboardContainer.classList.toggle('is-sidebar', isSidebarMode);

    // Adjust button titles and icons according to environment
    if (!isSidebarMode) {
        if (popOutBtn) {
            popOutBtn.title = "Dock to Sidebar (Minimize)";
            popOutBtn.innerHTML = "⤓";
        }
        if (minimizeBtn) {
            minimizeBtn.title = "Minimize / Dock to Sidebar";
            minimizeBtn.innerHTML = "🗕";
            minimizeBtn.classList.remove('active');
        }
    } else {
        if (popOutBtn) {
            popOutBtn.title = "Pop Out to Editor Tab";
            popOutBtn.innerHTML = "⤢";
        }
        if (minimizeBtn) {
            minimizeBtn.title = isCompact ? "Expand Full View" : "Minimize / Compact View";
            minimizeBtn.innerHTML = isCompact ? "🗖" : "🗕";
            minimizeBtn.classList.toggle('active', isCompact);
        }
    }

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

    // IDE Targets Summary & Auto-Detected Host
    const detected = data.detectedIde || { id: 'antigravity', displayName: 'Antigravity IDE', shortName: 'Antigravity' };
    if (ideSyncTitle) {
        ideSyncTitle.textContent = `🤖 ${detected.displayName} Hub`;
    }
    if (ideSyncSubtitle) {
        ideSyncSubtitle.textContent = `Auto-detected active host: ${detected.displayName}`;
    }

    const syncedCount = (ideStatus || []).filter(i => i.synced).length;
    const totalTargets = (ideStatus || []).length;
    activeTargetsVal.textContent = `${syncedCount} / ${totalTargets} Synced`;
    activeTargetsVal.style.color = syncedCount > 0 ? 'var(--accent-green)' : 'var(--accent-amber)';
    skillsScopeVal.textContent = detected.displayName;

    if (syncAllIdesBtn) {
        syncAllIdesBtn.textContent = totalTargets > 1 ? '⚡ Sync All' : '⚡ Sync Rule';
    }

    // Render IDE Grid (Current IDE targets only)
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

    // 1-Click Antigravity Skills Status (Green Tick when detected)
    const isSkillsInstalled = (typeof data.skillsInstalled === 'object' && data.skillsInstalled !== null)
        ? data.skillsInstalled.installed
        : Boolean(data.skillsInstalled);
    const skillsCount = (typeof data.skillsInstalled === 'object' && data.skillsInstalled !== null)
        ? data.skillsInstalled.count
        : (isSkillsInstalled ? 4 : 0);

    if (skillsStatusBadge) {
        if (isSkillsInstalled) {
            skillsStatusBadge.className = 'action-status-badge synced';
            skillsStatusBadge.innerHTML = '<span class="badge-icon">✓</span> <span class="badge-text">Active</span>';
            skillsStatusBadge.title = `RTK chat skills active (${skillsCount}/4 commands installed in IDE)`;
            if (skillsSubText) {
                skillsSubText.textContent = `✓ /rtk-* chat commands ready (${skillsCount}/4 active)`;
            }
        } else {
            skillsStatusBadge.className = 'action-status-badge install';
            skillsStatusBadge.innerHTML = '<span class="badge-text">+ Install</span>';
            skillsStatusBadge.title = 'Click to install Antigravity chat skills';
            if (skillsSubText) {
                skillsSubText.textContent = 'Install /rtk-* chat commands';
            }
        }
    }

    // Weekly Auto Sync Option State
    if (weeklySyncCheckbox && data.weeklyAutoSync !== undefined) {
        weeklySyncCheckbox.checked = Boolean(data.weeklyAutoSync);
    }
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
