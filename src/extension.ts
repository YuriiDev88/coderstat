import * as vscode from 'vscode';
import textCatcher from './textCatcher';



export function activate(context: vscode.ExtensionContext) {
	let myStatusBarItem: vscode.StatusBarItem;
	console.log('Congratulations, your extension "coderstat" is now active!');

	interface ITextCatcher {
		typeCount: number;
		deletionCount: number;
		symbolsTyped: number;
		symbolsDeleted: number;
	}

	enum StatViews {
		infoMessage = "INFO_MESSAGE"
	}

	const getStatsString = (stats: ITextCatcher) => {
		return Object.entries(stats).map(([statName, stat]) => `${statName}: ${stat}`).join('\n');
	};

	let disposable = vscode.commands.registerCommand('coderstat.helloWorld', () => {
		const stats =  {
				typeCount: 0,
				deletionCount: 0,
				symbolsTyped: 0,
				symbolsDeleted: 0,
			};		
		vscode.workspace.onDidChangeTextDocument((event) => {
			textCatcher(event, stats);	
		});
		vscode.window.showInformationMessage('Hello World from Velidoss !');
		
		const showStats = vscode.commands.registerCommand('coderstat.showStats', () => {
			const messageText = getStatsString(stats);
			vscode.window.showInformationMessage(messageText);
		});

		myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		myStatusBarItem.command = 'coderstat.showStats';
		console.log(myStatusBarItem);
		myStatusBarItem.text = 'coderStats';
		myStatusBarItem.show();
		context.subscriptions.push(showStats);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log("deactivated!");
	vscode.window.showOpenDialog();
}
