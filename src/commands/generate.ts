import * as vscode from 'vscode';
import { generateInjection } from '../core/injector';
import { checkInjectionNextStatus, openInjectionNext } from '../core/status';

export async function generateCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    if (document.languageId !== 'swift') return;

    const isRunning = await checkInjectionNextStatus();
    if (!isRunning) {
        const selection = await vscode.window.showWarningMessage(
            'InjectionNext is not running. Please start the InjectionNext app.',
            'Open InjectionNext'
        );
        if (selection === 'Open InjectionNext') {
            await openInjectionNext();
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
