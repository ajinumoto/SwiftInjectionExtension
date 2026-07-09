import * as vscode from 'vscode';
import { generateCommand } from './commands/generate';
import { removeCommand } from './commands/remove';
import { injectionService } from './services/injectionService';
import { statusBarService } from './services/statusBarService';
import { normalizePath } from './utils/path';

export function activate(context: vscode.ExtensionContext) {
    // Register commands
    let generateDisposable = vscode.commands.registerCommand('swift-injection.generate', generateCommand);
    let removeDisposable = vscode.commands.registerCommand('swift-injection.remove', removeCommand);

    let openNextDisposable = vscode.commands.registerCommand('swift-injection.openInjectionNext', async () => {
        statusBarService.setBusy(true);
        const success = await injectionService.launchApp();
        if (!success) {
            statusBarService.setBusy(false);
            await handleLaunchFailure();
        } else {
            setTimeout(() => {
                statusBarService.setBusy(false);
                statusBarService.update();
            }, 2000);
        }
    });

    let watchCurrentDisposable = vscode.commands.registerCommand('swift-injection.watchProject', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            statusBarService.setBusy(true);
            await injectionService.watchProject(workspaceFolders[0].uri.fsPath);
            statusBarService.setBusy(false);
            statusBarService.update();
        }
    });

    let statusBarActionDisposable = vscode.commands.registerCommand('swift-injection.statusBarAction', async () => {
        if (statusBarService.busy) return;
        
        const status = await injectionService.getStatus();
        if (!status.isRunning) {
            statusBarService.setBusy(true);
            const success = await injectionService.launchApp();
            if (!success) {
                statusBarService.setBusy(false);
                await handleLaunchFailure();
            } else {
                setTimeout(() => {
                    statusBarService.setBusy(false);
                    statusBarService.update();
                }, 2000);
            }
        } else {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                statusBarService.setBusy(true);
                const projectPath = workspaceFolders[0].uri.fsPath;
                const normalizedCurrent = normalizePath(projectPath);
                const isWatched = status.watchedDirectories?.some(dir => normalizePath(dir) === normalizedCurrent);
                if (!isWatched) {
                    await injectionService.watchProject(projectPath);
                }
                statusBarService.setBusy(false);
                statusBarService.update();
            }
        }
    });

    context.subscriptions.push(
        generateDisposable, 
        removeDisposable, 
        openNextDisposable, 
        watchCurrentDisposable,
        statusBarActionDisposable,
        statusBarService
    );

    // Update status bar periodically
    statusBarService.update();
    const interval = setInterval(() => {
        if (!statusBarService.busy) statusBarService.update();
    }, 5000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });

    // Auto-watch project on activation
    autoWatchProject();
}

async function handleLaunchFailure() {
    const selection = await vscode.window.showErrorMessage(
        'InjectionNext app not found on your system. Do you want to download it from GitHub?',
        'Download',
        'Cancel'
    );
    if (selection === 'Download') {
        vscode.env.openExternal(vscode.Uri.parse('https://github.com/johnno1962/InjectionNext'));
    }
}

async function autoWatchProject() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        const projectPath = workspaceFolders[0].uri.fsPath;
        const normalizedCurrent = normalizePath(projectPath);
        try {
            const status = await injectionService.getStatus();
            if (status.isRunning) {
                const isWatched = status.watchedDirectories?.some(dir => normalizePath(dir) === normalizedCurrent);
                if (!isWatched) {
                    await injectionService.watchProject(projectPath);
                }
            }
        } catch (error) {
            console.error('Failed to auto-watch project:', error);
        }
    }
}

export function deactivate() {}
