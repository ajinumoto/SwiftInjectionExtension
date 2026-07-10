import * as vscode from 'vscode';

export function getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>InjectionNext Companion</title>
        <style>
            body {
                padding: 10px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family, system-ui, sans-serif);
                font-size: var(--vscode-font-size, 13px);
                background-color: var(--vscode-sideBar-background);
            }
            .section {
                margin-bottom: 16px;
                padding: 12px;
                border-radius: 6px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.2));
            }
            .section-title {
                font-weight: bold;
                margin-top: 0;
                margin-bottom: 10px;
                text-transform: uppercase;
                font-size: 11px;
                letter-spacing: 0.5px;
                color: var(--vscode-descriptionForeground);
                border-bottom: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.1));
                padding-bottom: 4px;
            }
            .status-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 10px;
                text-transform: uppercase;
                margin-left: 6px;
            }
            .status-badge.online {
                background-color: var(--vscode-testing-iconPassed, #28a745);
                color: white;
            }
            .status-badge.offline {
                background-color: var(--vscode-testing-iconFailed, #dc3545);
                color: white;
            }
            .badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: 600;
                background-color: var(--vscode-badge-background, rgba(128,128,128,0.15));
                color: var(--vscode-badge-foreground, var(--vscode-foreground));
            }
            .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 10px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 12px;
            }
            .info-label {
                color: var(--vscode-descriptionForeground);
            }
            .info-value {
                font-weight: 500;
            }
            button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-weight: 500;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 12px;
            }
            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            button.secondary {
                background-color: var(--vscode-button-secondaryBackground, rgba(128,128,128,0.2));
                color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
            }
            button.secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground, rgba(128,128,128,0.3));
            }
            button:disabled, button.secondary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }
            .header h3 {
                margin: 0;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h3>⚡ InjectionNext Companion</h3>
            <span id="app-status" class="status-badge offline">Offline</span>
        </div>

        <!-- Status Section -->
        <div class="section">
            <div class="section-title">Status Overview</div>
            <div class="info-row">
                <span class="info-label">Xcode Running:</span>
                <span id="xcode-running" class="info-value">No</span>
            </div>
            <div class="info-row">
                <span class="info-label">Compiler Intercepted:</span>
                <span id="compiler-intercepted" class="badge">No</span>
            </div>
            <div class="info-row">
                <span class="info-label">Connected Client:</span>
                <span id="client-connected" class="badge">No</span>
            </div>
            <div class="info-row">
                <span class="info-label">Device Injection:</span>
                <span id="device-enabled" class="badge">No</span>
            </div>
        </div>

        <!-- Event Recorder Section -->
        <div class="section">
            <div class="section-title">Event Recorder</div>
            <div class="info-row">
                <span class="info-label">Recorded Events:</span>
                <span id="record-count" class="badge">0</span>
            </div>
            <div style="margin-top: 8px;">
                <button id="btn-record">⏺️ Record Action</button>
                <div class="grid-2">
                    <button id="btn-replay" class="secondary" disabled>▶️ Replay</button>
                    <button id="btn-remove-events" class="secondary" disabled>🗑️ Remove</button>
                </div>
            </div>
        </div>

        <!-- Logs & Tools Utilities -->
        <div class="section">
            <div class="section-title">App Tools & Logs</div>
            <div class="grid-2">
                <button id="btn-unhide-symbols">🔧 Unhide Symbols</button>
                <button id="btn-show-logs" class="secondary">Show Logs</button>
            </div>
        </div>

        <!-- Footer Connection Note -->
        <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.15)); font-size: 10.5px; color: var(--vscode-descriptionForeground); text-align: center; line-height: 1.4;">
            All tools communicate directly with your running local <strong>InjectionNext</strong> main application via control socket. This extension acts as a shortcut client to invoke actions and display responses.
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            // Status elements
            const appStatus = document.getElementById('app-status');
            const xcodeRunning = document.getElementById('xcode-running');
            const compilerIntercepted = document.getElementById('compiler-intercepted');
            const clientConnected = document.getElementById('client-connected');
            const deviceEnabled = document.getElementById('device-enabled');

            // Recorder elements
            let recordedEvents = [];
            const recordCount = document.getElementById('record-count');
            const btnRecord = document.getElementById('btn-record');
            const btnReplay = document.getElementById('btn-replay');
            const btnRemoveEvents = document.getElementById('btn-remove-events');

            // Setup Action Handlers
            document.getElementById('btn-unhide-symbols').addEventListener('click', () => vscode.postMessage({ command: 'unhideSymbols' }));
            document.getElementById('btn-show-logs').addEventListener('click', () => vscode.postMessage({ command: 'showLogs' }));

            // Recorder Handlers
            btnRecord.addEventListener('click', () => {
                vscode.postMessage({ command: 'getTouchEvents' });
            });

            btnRemoveEvents.addEventListener('click', () => {
                recordedEvents = [];
                updateRecorderUI();
            });

            btnReplay.addEventListener('click', () => {
                if (recordedEvents.length > 0) {
                    vscode.postMessage({ command: 'replayTouchEvents', events: recordedEvents });
                }
            });

            function updateRecorderUI() {
                recordCount.innerText = recordedEvents.length;
                if (recordedEvents.length > 0) {
                    btnReplay.removeAttribute('disabled');
                    btnRemoveEvents.removeAttribute('disabled');
                    recordCount.style.backgroundColor = 'var(--vscode-testing-iconPassed)';
                    recordCount.style.color = 'white';
                } else {
                    btnReplay.setAttribute('disabled', 'true');
                    btnRemoveEvents.setAttribute('disabled', 'true');
                    recordCount.style.backgroundColor = '';
                    recordCount.style.color = '';
                }
            }

            // Handle messages sent from the extension to the webview
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'status':
                        const s = message.status;
                        if (s.isRunning) {
                            appStatus.innerText = 'Online';
                            appStatus.className = 'status-badge online';
                            
                            const d = s.data || {};
                            xcodeRunning.innerText = d.xcode_running ? 'Yes' : 'No';
                            
                            compilerIntercepted.innerText = d.compiler_intercepted ? 'Intercepted' : 'Normal';
                            compilerIntercepted.style.backgroundColor = d.compiler_intercepted ? 'var(--vscode-testing-iconPassed)' : '';
                            compilerIntercepted.style.color = d.compiler_intercepted ? 'white' : '';

                            clientConnected.innerText = d.has_connected_client ? 'Connected' : 'Waiting';
                            clientConnected.style.backgroundColor = d.has_connected_client ? 'var(--vscode-testing-iconPassed)' : '';
                            clientConnected.style.color = d.has_connected_client ? 'white' : '';

                            deviceEnabled.innerText = d.devices_enabled ? 'Enabled' : 'Disabled';
                            deviceEnabled.style.backgroundColor = d.devices_enabled ? 'var(--vscode-testing-iconPassed)' : '';
                            deviceEnabled.style.color = d.devices_enabled ? 'white' : '';
                        } else {
                            appStatus.innerText = 'Offline';
                            appStatus.className = 'status-badge offline';
                            xcodeRunning.innerText = 'No';
                            compilerIntercepted.innerText = 'No';
                            compilerIntercepted.style.backgroundColor = '';
                            clientConnected.innerText = 'No';
                            clientConnected.style.backgroundColor = '';
                            deviceEnabled.innerText = 'No';
                            deviceEnabled.style.backgroundColor = '';
                        }
                        break;

                    case 'touchEvents':
                        if (message.events && message.events.length > 0) {
                            recordedEvents = recordedEvents.concat(message.events);
                            vscode.postMessage({ command: 'getStatus' }); // refresh status too
                        }
                        updateRecorderUI();
                        break;
                }
            });

            // Get status on load
            vscode.postMessage({ command: 'getStatus' });
        </script>
    </body>
    </html>`;
}
