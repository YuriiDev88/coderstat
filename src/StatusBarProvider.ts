import * as vscode from 'vscode';
import ICoderStat from './interfaces/ICoderStat';
import textCatcher from './textCatcher';
import { getStatsString, getWebViewString, getWebviewTemplate } from './utils';

let myStatusBarItem: vscode.StatusBarItem;

const StatusBarProvider = (stats: ICoderStat, context: vscode.ExtensionContext) => {
	
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
      {enableScripts: true}
    );
    panel.webview.html = getWebviewTemplate(messageText);

    vscode.workspace.onDidChangeTextDocument((event) => {
      const messageText = getWebViewString(stats);
      panel.webview.html = getWebviewTemplate(messageText);
    });
  });

  myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  myStatusBarItem.command = 'coderstat.openPick';
  myStatusBarItem.text = 'coderStats';
  myStatusBarItem.show();
  context.subscriptions.push(showStats, showStatsWeb);
};

export default StatusBarProvider;