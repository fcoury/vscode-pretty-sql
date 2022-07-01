import axios from "axios";
import * as FormData from "form-data";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "pretty-sql.format",
    async () => {
      const data = new FormData();
      const sql = vscode.window.activeTextEditor?.document?.getText();
      data.append("sql", sql);
      data.append("reindent", 1);

      const res = await axios({
        method: "POST",
        url: "https://sqlformat.org/api/v1/format",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const newText = res.data.result;
        await editor.edit((editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length)
            ),
            newText
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
