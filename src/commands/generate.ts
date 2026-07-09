import * as vscode from 'vscode';
import { generateInjection } from '../core/injector';
import { injectionService } from '../services/injectionService';
import { normalizePath } from '../utils/path';

export async function generateCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    if (document.languageId !== 'swift') return;

    const status = await injectionService.getStatus();
    
    if (!status.isRunning) {
        const selection = await vscode.window.showWarningMessage(
            'InjectionNext is not running. Please start the InjectionNext app.',
            'Open InjectionNext'
        );
        if (selection === 'Open InjectionNext') {
            await injectionService.launchApp();
        }
        return;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const projectPath = workspaceFolders[0].uri.fsPath;
        const normalizedCurrent = normalizePath(projectPath);
        const isWatched = status.watchedDirectories?.some(dir => normalizePath(dir) === normalizedCurrent);
        
        if (!isWatched) {
            const selection = await vscode.window.showWarningMessage(
                `Project is not being watched by InjectionNext.`,
                'Watch Project'
            );
            if (selection === 'Watch Project') {
                await injectionService.watchProject(projectPath);
            }
            return;
        }
    }

    const text = document.getText();
    const newText = generateInjection(text);

    if (newText !== text) {
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
        
        editor.edit(editBuilder => {
            editBuilder.replace(textRange, newText);
        });
    }
}
