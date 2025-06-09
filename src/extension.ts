import * as vscode from "vscode";

function roundToMultipleOf8(pxValue: number): number {
  // Arrondir à 2 décimales pour éviter les erreurs d'arrondi
  const value = Math.round(pxValue * 100) / 100;
  
  // Calculer les multiples les plus proches
  const roundedTo8 = Math.round(value / 8) * 8;
  const roundedTo4 = Math.round(value / 4) * 4;
  
  // Calculer les différences
  const diffTo8 = Math.abs(value - roundedTo8);
  const diffTo4 = Math.abs(value - roundedTo4);
  
  // Si on est très proche d'un multiple de 8 (à 1px près), on le prend
  if (diffTo8 <= 1) {
    return roundedTo8;
  }
  
  // Si on est plus proche d'un multiple de 4 que de 8, on prend le multiple de 4
  if (diffTo4 < diffTo8) {
    return roundedTo4;
  }
  
  // Sinon, on prend le multiple de 8
  return roundedTo8;
}

function processDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const edits: vscode.TextEdit[] = [];
  const text = document.getText();

  // Expression régulière pour trouver les valeurs numériques avec unités
  const pxRegex = /(\d*\.?\d+)(px)/g;
  let match;

  while ((match = pxRegex.exec(text)) !== null) {
    const originalNumber = parseFloat(match[1]);
    const unit = match[2];
    let roundedValue = originalNumber;
    
    // Ne pas arrondir les pourcentages ou les valeurs très petites
    if (originalNumber >= 1 || unit !== '%') {
      roundedValue = roundToMultipleOf8(originalNumber);
    }

    // Formater le résultat avec le même nombre de décimales que l'original
    const decimalPlaces = (match[1].split('.')[1] || '').length;
    const formattedValue = decimalPlaces > 0 
      ? roundedValue.toFixed(decimalPlaces)
      : Math.round(roundedValue).toString();

    if (originalNumber !== parseFloat(formattedValue)) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new vscode.Range(startPos, endPos);
      const edit = vscode.TextEdit.replace(range, `${formattedValue}${unit}`);
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
      if (!["css"].includes(document.languageId)) {
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

    const validLanguages = ["css"];
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
