import * as vscode from 'vscode';
import StatusBarProvider from './StatusBarProvider';
import QuickPickProvider from './QuickPickProvider';
import {NodeDependenciesProvider} from './treeView/TreeDataProvider';
import { getStatsString, getWebviewTemplate } from './utils';

const cats = {
  'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "coderstat" is now active!');

	enum StatViews {
		infoMessage = "INFO_MESSAGE"
	}

	const stats =  {
			typeCount: 0,
			deletionCount: 0,
			symbolsTyped: 0,
			symbolsDeleted: 0,
		};	

  const updateWebView = (webViewPanel: vscode.WebviewPanel) => {
    console.log('updated');
    const messageText = getStatsString(stats);
    webViewPanel.webview.html = getWebviewTemplate(messageText);
  };
	
	let disposable = vscode.commands.registerCommand('coderstat.helloWorld', () => StatusBarProvider(stats, context));
	const quickPick = vscode.commands.registerCommand('coderstat.openPick', QuickPickProvider);

  vscode.window.registerTreeDataProvider( 
    'coderStats',
    new NodeDependenciesProvider(
      vscode.workspace.workspaceFolders 
      ? vscode.workspace.workspaceFolders[0].uri.path
      : ''
    )
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

	context.subscriptions.push(disposable, quickPick);
}

export function deactivate() {
	console.log("deactivated!");
	vscode.window.showOpenDialog();
}
