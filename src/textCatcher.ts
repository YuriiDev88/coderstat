import * as vscode from 'vscode';
import ICoderStat from './interfaces/ICoderStat';

const textCatcher = (event: vscode.TextDocumentChangeEvent, stats: ICoderStat): ICoderStat => {

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
  return stats;
};

export default textCatcher;