import * as vscode from 'vscode';

const QuickPickProvider = () => {
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
    if (selection[0].label === "webView") {
      vscode.commands.executeCommand('coderstat.showStatsWeb');
      pickView.hide();
    }
    if (selection[0].label === "informationMessage") {
      vscode.commands.executeCommand('coderstat.showStats');
      pickView.hide();
    }
  });
  pickView.onDidHide(() => pickView.dispose());
  pickView.show();
};

export default QuickPickProvider;