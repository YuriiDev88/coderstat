import * as vscode from 'vscode';
import textCatcher from './textCatcher';

const cats = {
  'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

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

	const getStatsString = (stats: ITextCatcher): string => {
		return Object.entries(stats).map(([statName, stat]) => `${statName}: ${stat}`).join('\n');
	};

	const getWebViewString = (stats: ITextCatcher): string  => {
		return Object.entries(stats).map(([statName, stat]) => `<p>${statName}: ${stat}</p>`).join(' ');
	};

	const stats =  {
			typeCount: 0,
			deletionCount: 0,
			symbolsTyped: 0,
			symbolsDeleted: 0,
		};	
	
	let disposable = vscode.commands.registerCommand('coderstat.helloWorld', () => {
	
		vscode.workspace.onDidChangeTextDocument((event) => {
			textCatcher(event, stats);	
		});
		vscode.window.showInformationMessage('Hello World from Velidoss !');
		
		const showStats = vscode.commands.registerCommand('coderstat.showStats', () => {
			const messageText = getStatsString(stats);
			vscode.window.showInformationMessage(messageText);
		});

		const showStatsWeb = vscode.commands.registerCommand('coderstat.showStatsWeb', () => {
			const messageText = getWebViewString(stats);
			const panel = vscode.window.createWebviewPanel(
				'CoderStats', 
				'Coder Stats',
				vscode.ViewColumn.One,
				{}
			);
			panel.webview.html = getWebviewTemplate(messageText);
		});

		myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		myStatusBarItem.command = 'coderstat.openPick';
		console.log(myStatusBarItem);
		myStatusBarItem.text = 'coderStats';
		myStatusBarItem.show();
		context.subscriptions.push(showStats, showStatsWeb);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('coderstat.openPick', () => {
			const pickItems = [
				{
					label: "informationMessage",
					detail: "show stats in the information message"
				},
				{
					label: "webView",
					detail: "show stats in new web view window"
				}
			];

			const pickView = vscode.window.createQuickPick();
			pickView.items = pickItems;
			pickView.onDidChangeSelection(selection => {
				console.log(selection);
				if (selection[0].label === "webView") {
					vscode.commands.executeCommand('coderstat.showStatsWeb');
				}
				if (selection[0].label === "informationMessage") {
					vscode.commands.executeCommand('coderstat.showStats');
				}
			});
			pickView.onDidHide(() => pickView.dispose());
			pickView.show();
	})
);

	context.subscriptions.push(
    vscode.commands.registerCommand('coderstat.catStart', () => {
      const panel = vscode.window.createWebviewPanel(
        'catCoding',
        'Cat Coding',
        vscode.ViewColumn.One,
        {}
      );

      let iteration = 0;
      const updateWebview = () => {
        const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
        panel.title = cat;
        panel.webview.html = getWebviewContent(cat);
      };

      // Set initial content
      updateWebview();

      // And schedule updates to the content every second
      const interval = setInterval(updateWebview, 1000);

			panel.onDidDispose(
        () => {
          // When the panel is closed, cancel any future updates to the webview content
          clearInterval(interval);
        },
        null,
        context.subscriptions
      );
    })
  );

	function getWebviewTemplate(content: string) {
		return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
	</head>
	<body>
			${content}
	</body>
	</html>`;
	}

	function getWebviewContent(cat: keyof typeof cats) {
		return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Cat Coding</title>
	</head>
	<body>
			<img src="${cats[cat]}" width="300" />
	</body>
	</html>`;
	}

	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log("deactivated!");
	vscode.window.showOpenDialog();
}
