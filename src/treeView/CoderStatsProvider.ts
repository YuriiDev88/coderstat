import * as vscode from  'vscode';
import * as path from 'path';
import ICoderStat from '../interfaces/ICoderStat';

export class CoderStatsProvider implements vscode.TreeDataProvider<Dependency> {

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private stats: ICoderStat){}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

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

  iconPath =  {
    light: path.join(__filename, '..', '..', 'media', 'copy.svg'),
    dark: path.join(__filename, '..', '..', 'media', 'copy.svg')
  };

}

