// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { JsonExplorerEditorProvider } from './JsonExplorer';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(JsonExplorerEditorProvider.register(context));
}

// this method is called when your extension is deactivated
export function deactivate() {}
