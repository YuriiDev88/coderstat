import * as vscode from 'vscode';

interface ITextCatcher {
  typeCount: number;
  deletionCount: number;
  symbolsTyped: number;
  symbolsDeleted: number;
}

const textCatcher = (event: vscode.TextDocumentChangeEvent, stats: ITextCatcher): ITextCatcher => {

  const {rangeLength, text} = event.contentChanges[0];

  if (text.length > 0) {
    stats = {
      ...stats, 
      typeCount: stats.typeCount += 1,
      symbolsTyped: stats.symbolsTyped += text.length,

    };
  } 
  else {
    stats = {
      ...stats,
       deletionCount: stats.deletionCount += 1,
       symbolsDeleted: stats.symbolsDeleted += rangeLength
      };
  }

  console.log(stats, event.contentChanges[0]);
  // vscode.window.showInformationMessage(Object.entries(stats).map(([statName, stat]) => `${statName}: ${stat}`).join('|'));
  return stats;
};

export default textCatcher;