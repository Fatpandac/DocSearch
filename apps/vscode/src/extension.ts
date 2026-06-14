import * as vscode from "vscode";
import { data, DocID } from "@docsearch/core";
import { SearchPanel } from "./searchPanel";

export function activate(context: vscode.ExtensionContext) {
  for (const idStr of Object.keys(data)) {
    const id = parseInt(idStr) as DocID;
    const commandId = `docsearch.${DocID[id].toLowerCase()}`;
    const disposable = vscode.commands.registerCommand(commandId, () => SearchPanel.show(id, context));
    context.subscriptions.push(disposable);
  }
}

export function deactivate() {}
