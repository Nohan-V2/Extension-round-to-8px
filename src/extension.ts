import * as vscode from "vscode";

function roundToMultipleOf8(pxValue: number): number {
  // Essayer d'abord d'arrondir au multiple de 8 le plus proche
  const roundedTo8 = Math.round(pxValue / 8) * 8;
  
  // Si la différence est de 4 ou moins, on garde le multiple de 8
  if (Math.abs(pxValue - roundedTo8) <= 4) {
    return roundedTo8;
  }
  
  // Sinon, on arrondit au multiple de 4 le plus proche
  return Math.round(pxValue / 4) * 4;
}

function processDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const edits: vscode.TextEdit[] = [];
  const text = document.getText();

  // Expression régulière pour trouver les valeurs en pixels
  const pxRegex = /(\d+)px/g;
  let match;

  while ((match = pxRegex.exec(text)) !== null) {
    const originalValue = parseInt(match[1], 10);
    const roundedValue = roundToMultipleOf8(originalValue);

    if (originalValue !== roundedValue) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);
      const edit = vscode.TextEdit.replace(range, `${roundedValue}px`);
      edits.push(edit);
    }
  }

  return edits;
}

function applyEdits(editor: vscode.TextEditor, document: vscode.TextDocument): Thenable<boolean> {
  console.log(`Traitement du fichier: ${document.fileName}`);
  const edits = processDocument(document);
  console.log(`${edits.length} modifications trouvées`);

  if (edits.length === 0) {
    console.log("Aucune modification nécessaire");
    return Promise.resolve(false);
  }

  return editor.edit((editBuilder) => {
    edits.forEach((edit) => {
      editBuilder.replace(edit.range, edit.newText);
    });
  }).then((success) => {
    if (success) {
      vscode.window.showInformationMessage(
        `${edits.length} valeur(s) en pixels arrondie(s) au multiple de 8`
      );
    }
    return success;
  });
}

export function activate(context: vscode.ExtensionContext) {
  // Commande manuelle
  const disposable = vscode.commands.registerCommand(
    "round-to-8px.roundPixels",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("Aucun éditeur actif");
        return;
      }

      const document = editor.document;
      if (!["css", "scss", "less"].includes(document.languageId)) {
        vscode.window.showWarningMessage("Ce fichier n'est pas un fichier CSS");
        return;
      }

      return applyEdits(editor, document);
    }
  );

  // Écouteur pour la sauvegarde automatique
  const saveDisposable = vscode.workspace.onWillSaveTextDocument(event => {
    const document = event.document;
    const editor = vscode.window.activeTextEditor;

    console.log(`Événement de sauvegarde déclenché pour: ${document.fileName}`);
    console.log(`Type de document: ${document.languageId}`);

    if (!editor || document !== editor.document) {
      console.log("Aucun éditeur actif ou document non correspondant");
      return;
    }

    const validLanguages = ["css", "scss", "less"];
    if (!validLanguages.includes(document.languageId)) {
      console.log(`Type de document non pris en charge: ${document.languageId}`);
      return;
    }

    console.log("Application des modifications...");
    event.waitUntil(applyEdits(editor, document));
  });

  context.subscriptions.push(disposable, saveDisposable);
}

export function deactivate(): void {
  // Cette fonction est requise par l'API VSCode
}
