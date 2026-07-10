import * as vscode from 'vscode';
import { generateInjection } from '../core/injector';

export async function generateCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    if (document.languageId !== 'swift') return;

    const text = document.getText();
    const newText = generateInjection(text);

    if (newText !== text) {
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
        
        await editor.edit(editBuilder => {
            editBuilder.replace(textRange, newText);
        });
    }
}
