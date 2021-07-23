import * as vscode from 'vscode';
import StatusBarProvider from './StatusBarProvider';
import QuickPickProvider from './QuickPickProvider';
import { CoderStatsProvider } from './treeView/CoderStatsProvider';
import ICoderStat from './interfaces/ICoderStat';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "coderstat" is now active!');

  const stats: ICoderStat =  {
    typeCount: 0,
    deletionCount: 0,
    symbolsTyped: 0,
    symbolsDeleted: 0,
  };

  const disposable = vscode.commands.registerCommand('coderstat.startApp',
   () => StatusBarProvider(stats, context, refreshProvider, resetCoderStatsCallBack));
  const quickPick = vscode.commands.registerCommand('coderstat.openPick', QuickPickProvider);

  const coderStatsProvider =  new CoderStatsProvider(stats);

  vscode.window.registerTreeDataProvider(
    'coderData',
    coderStatsProvider
  );

  function refreshProvider (): void {coderStatsProvider.refresh()};

  function resetCoderStatsCallBack (): void {
    stats.typeCount = 0;
    stats.deletionCount = 0;
    stats.symbolsTyped = 0;
    stats.symbolsDeleted = 0;
    refreshProvider();
  }

  const filesRefresher = vscode.commands.registerCommand('coderstat.refreshStats',refreshProvider);

  context.subscriptions.push(disposable, quickPick, filesRefresher);
}

export function deactivate() {
  console.log("Good bye!");
  vscode.window.showOpenDialog();
}
