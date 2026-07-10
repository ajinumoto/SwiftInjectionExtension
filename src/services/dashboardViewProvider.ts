import * as vscode from 'vscode';
import { injectionService } from './injectionService';
import { getHtmlForWebview } from '../views/dashboardHtml';

export class DashboardViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'swift-injection.dashboard';
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionContext: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionContext.extensionUri]
        };

        // Render HTML presentation layer using view module
        webviewView.webview.html = getHtmlForWebview(webviewView.webview);

        // Act as a controller to route webview messages
        webviewView.webview.onDidReceiveMessage(async (message) => {
            try {
                switch (message.command) {
                    case 'getStatus': {
                        await this.updateStatus();
                        break;
                    }
                    case 'unhideSymbols': {
                        const res = await injectionService.unhideSymbols();
                        if (res && res.success) {
                            vscode.window.showInformationMessage('Unhide symbols task completed');
                        } else {
                            vscode.window.showErrorMessage(`Failed to unhide symbols: ${res?.error || 'Unknown error'}`);
                        }
                        await this.updateStatus();
                        break;
                    }
                    case 'getTouchEvents': {
                        const res = await injectionService.getTouchEvents();
                        if (res && res.success) {
                            const events = res.data?.events || [];
                            webviewView.webview.postMessage({ type: 'touchEvents', events });
                        } else {
                            vscode.window.showErrorMessage('Failed to fetch touch events from client app.');
                        }
                        break;
                    }
                    case 'replayTouchEvents': {
                        const res = await injectionService.replayTouchEvents(message.events);
                        if (res && res.success) {
                            vscode.window.showInformationMessage(`Replayed ${res.data?.events ?? 0} touch events`);
                        } else {
                            vscode.window.showErrorMessage('Failed to replay touch events');
                        }
                        break;
                    }
                    case 'showLogs': {
                        await vscode.commands.executeCommand('swift-injection.showLogs');
                        break;
                    }
                }
            } catch (err) {
                vscode.window.showErrorMessage(`Error executing action: ${(err as Error).message}`);
            }
        });

        // Immediate status query
        this.updateStatus();

        // Status poll interval when the view is visible
        const interval = setInterval(() => {
            if (this._view && this._view.visible) {
                this.updateStatus();
            }
        }, 3000);

        webviewView.onDidDispose(() => {
            clearInterval(interval);
        });
    }

    private async updateStatus() {
        if (!this._view) return;
        const status = await injectionService.getStatus();
        this._view.webview.postMessage({ type: 'status', status });
    }
}
