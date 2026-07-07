import * as vscode from 'vscode';
import { generateCommand } from './commands/generate';
import { removeCommand } from './commands/remove';

export function activate(context: vscode.ExtensionContext) {
    let generateDisposable = vscode.commands.registerCommand('swift-injection.generate', generateCommand);
    let removeDisposable = vscode.commands.registerCommand('swift-injection.remove', removeCommand);

    context.subscriptions.push(generateDisposable, removeDisposable);
}

export function deactivate() {}
