// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "blueprint" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('blueprint.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('blueprint.HowDay', async () => {
		let answer = await vscode.window.showInformationMessage('How is your day?', 'good', 'bad');
		if (answer === 'bad'){
			if (HelloWorldPanel.currentPanel){
				console.log("VS code will send a message now");
				HelloWorldPanel.currentPanel._panel.webview.postMessage({"type":"jsonFile", "value":"Mensagem que foi enviada"});
				console.log("VS code sent a message now");
			};
			vscode.window.showInformationMessage('Sorry');
		} else if (answer === 'good'){
			vscode.window.showInformationMessage('Nice');
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
