import * as vscode from  'vscode';
import * as path from 'path';
import ICoderStat from '../interfaces/ICoderStat';

export class CoderStatsProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private stats: ICoderStat){}

  getTreeItem(element: Dependency): vscode.TreeItem {
    console.log(element);
    return element;
  }

  getChildren(element: Dependency): Thenable<Dependency[]>{
    return Promise.resolve(this.getStatsData());
  }

  private getStatsData (): Dependency[]{
    return Object.entries(this.stats).map((stat) => new Dependency(`${stat[0]}: ${stat[1]}`));
  }

};

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
  ) {
    super(label);
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'src', 'media', 'copy.svg'),
    dark: path.join(__filename, '..', '..', 'src', 'media', 'copy.svg')
  };

}

