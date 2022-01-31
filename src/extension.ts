// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { LogExplorerEditorProvider } from './LogExplorer';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(LogExplorerEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
