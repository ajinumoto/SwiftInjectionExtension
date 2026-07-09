import * as vscode from 'vscode';
import { generateCommand } from './commands/generate';
import { removeCommand } from './commands/remove';
import { checkInjectionNextStatus, openInjectionNext } from './core/status';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    let generateDisposable = vscode.commands.registerCommand('swift-injection.generate', generateCommand);
    let removeDisposable = vscode.commands.registerCommand('swift-injection.remove', removeCommand);

    // Status Bar Item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'swift-injection.openInjectionNext';
    context.subscriptions.push(statusBarItem);

    let openNextDisposable = vscode.commands.registerCommand('swift-injection.openInjectionNext', async () => {
        await openInjectionNext();
    });

    context.subscriptions.push(generateDisposable, removeDisposable, openNextDisposable);

    // Update status bar periodically
    updateStatusBar();
    const interval = setInterval(updateStatusBar, 5000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });
}

async function updateStatusBar() {
    const isRunning = await checkInjectionNextStatus();
    if (isRunning) {
        statusBarItem.text = `$(zap) InjectionActive`;
        statusBarItem.tooltip = 'InjectionNext is running';
        statusBarItem.backgroundColor = undefined;
    } else {
        statusBarItem.text = `$(warning) InjectionNext Off`;
        statusBarItem.tooltip = 'InjectionNext is not running. Click to open.';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
    statusBarItem.show();
}

export function deactivate() {}
