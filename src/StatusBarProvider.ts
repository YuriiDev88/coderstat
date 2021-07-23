import * as vscode from 'vscode';
import ICoderStat from './interfaces/ICoderStat';
import textCatcher from './textCatcher';
import { getStatsString, getWebViewString, getWebviewTemplate } from './utils';

let myStatusBarItem: vscode.StatusBarItem;
let WebViewPanel: vscode.WebviewPanel;

const StatusBarProvider = (
    stats: ICoderStat, 
    context: vscode.ExtensionContext, 
    refreshProvider: () => void,
    resetCoderStatsCallBack: () => void,
  ) => {

  vscode.workspace.onDidChangeTextDocument((event) => {
    textCatcher(event, stats);
    refreshProvider();
  });
  vscode.window.showInformationMessage('CoderStat launched! Watch on explorer, or click on "coderStats" on left sidebar');
  
  const showStats = vscode.commands.registerCommand('coderstat.showStats', () => {
    const messageText = getStatsString(stats);
    vscode.window.showInformationMessage(messageText);
  });

  const resetCoderStats = vscode.commands.registerCommand('coderstat.resetStats', () => {
    resetCoderStatsCallBack();
    if (WebViewPanel) {
      const messageText = getWebViewString(stats);
      WebViewPanel.webview.html = getWebviewTemplate(messageText);
    }
  })

  const showStatsWeb = vscode.commands.registerCommand('coderstat.showStatsWeb', () => {
    const messageText = getWebViewString(stats);
    WebViewPanel= vscode.window.createWebviewPanel(
      'CoderStats', 
      'Coder Stats',
      vscode.ViewColumn.One,
      {enableScripts: true}
    );
    WebViewPanel.webview.html = getWebviewTemplate(messageText);

    vscode.workspace.onDidChangeTextDocument((event) => {
      const messageText = getWebViewString(stats);
      WebViewPanel.webview.html = getWebviewTemplate(messageText);
    });
  });

  myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  myStatusBarItem.command = 'coderstat.openPick';
  myStatusBarItem.text = 'coderStats';
  myStatusBarItem.show();
  context.subscriptions.push(showStats, showStatsWeb, resetCoderStats);
};

export default StatusBarProvider;