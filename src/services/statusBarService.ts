import * as vscode from 'vscode';
import { injectionService } from './injectionService';
import { normalizePath } from '../utils/path';

export class StatusBarService {
    private statusBarItem: vscode.StatusBarItem;
    private isBusy: boolean = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'swift-injection.statusBarAction';
    }

    get item() {
        return this.statusBarItem;
    }

    setBusy(busy: boolean) {
        this.isBusy = busy;
        if (busy) {
            this.statusBarItem.text = `$(sync~spin) Processing...`;
            this.statusBarItem.tooltip = 'Communicating with InjectionNext...';
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.show();
        }
    }

    get busy() {
        return this.isBusy;
    }

    async update() {
        if (this.isBusy) return;

        const status = await injectionService.getStatus();
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const projectPath = workspaceFolders ? workspaceFolders[0].uri.fsPath : undefined;

        if (!status.isRunning) {
            this.statusBarItem.text = `$(warning) InjectionNext Off`;
            this.statusBarItem.tooltip = 'InjectionNext is not running. Click to open.';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            const normalizedCurrent = projectPath ? normalizePath(projectPath) : undefined;
            const isWatched = normalizedCurrent ? status.watchedDirectories?.some((dir: string) => normalizePath(dir) === normalizedCurrent) : false;
            
            if (isWatched) {
                this.statusBarItem.text = `$(zap) InjectionActive`;
                this.statusBarItem.tooltip = 'InjectionNext is watching this project';
                this.statusBarItem.backgroundColor = undefined;
            } else {
                this.statusBarItem.text = `$(eye) Watch Project?`;
                this.statusBarItem.tooltip = 'InjectionNext is running but not watching this project. Click to watch.';
                this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            }
        }
        this.statusBarItem.show();
    }

    dispose() {
        this.statusBarItem.dispose();
    }
}

export const statusBarService = new StatusBarService();
