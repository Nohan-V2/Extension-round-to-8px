"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function roundToMultipleOf8(pxValue) {
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
function roundRemValue(remValue) {
    // Arrondir à 2 décimales pour éviter les erreurs d'arrondi
    const value = Math.round(remValue * 100) / 100;
    // Arrondir au multiple de 0.5 le plus proche
    const roundedToHalf = Math.round(value * 2) / 2;
    // Si la valeur est très proche d'un multiple de 0.25 (à 0.1 près), on arrondit à 0.25
    const roundedToQuarter = Math.round(value * 4) / 4;
    const diffToQuarter = Math.abs(value - roundedToQuarter);
    if (diffToQuarter <= 0.1) {
        return roundedToQuarter;
    }
    // Sinon, on retourne le multiple de 0.5
    return roundedToHalf;
}
function processDocument(document) {
    const edits = [];
    const text = document.getText();
    // Expression régulière pour trouver les propriétés de marge, padding et gap avec leurs valeurs
    const propertyRegex = /(margin|margin-top|margin-right|margin-bottom|margin-left|padding|padding-top|padding-right|padding-bottom|padding-left|gap|row-gap|column-gap|top|right|bottom|left|inset|inset-block|inset-block-start|inset-block-end|inset-inline|inset-inline-start|inset-inline-end|width|height|min-width|max-width|min-height|max-height|font-size|line-height|border-radius|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius)[\s\t]*:[\s\t]*([^;{}]*)/gi;
    // Expression régulière pour trouver les valeurs numériques avec unités (px ou rem)
    const unitRegex = /(\d*\.?\d+)(px|rem)/g;
    let propertyMatch;
    // Parcourir toutes les propriétés margin, padding et gap
    while ((propertyMatch = propertyRegex.exec(text)) !== null) {
        const propertyValue = propertyMatch[2];
        let valueMatch;
        // Parcourir toutes les valeurs numériques dans la valeur de la propriété
        while ((valueMatch = unitRegex.exec(propertyValue)) !== null) {
            const originalNumber = parseFloat(valueMatch[1]);
            const unit = valueMatch[2];
            let roundedValue = originalNumber;
            // Appliquer l'arrondi approprié selon l'unité
            if (unit === "px" && originalNumber >= 1) {
                roundedValue = roundToMultipleOf8(originalNumber);
            }
            else if (unit === "rem") {
                roundedValue = roundRemValue(originalNumber);
            }
            // Formater le résultat avec le même nombre de décimales que l'original
            const decimalPlaces = (valueMatch[1].split(".")[1] || "").length;
            const formattedValue = decimalPlaces > 0
                ? roundedValue.toFixed(decimalPlaces)
                : Math.round(roundedValue).toString();
            if (originalNumber !== parseFloat(formattedValue)) {
                // Calculer la position dans le document
                const valueStartInDocument = propertyMatch.index +
                    propertyMatch[0].indexOf(valueMatch[0], propertyMatch[0].indexOf(":"));
                const startPos = document.positionAt(valueStartInDocument);
                const endPos = document.positionAt(valueStartInDocument + valueMatch[0].length);
                const range = new vscode.Range(startPos, endPos);
                const edit = vscode.TextEdit.replace(range, `${formattedValue}${unit}`);
                edits.push(edit);
            }
        }
    }
    return edits;
}
function applyEdits(editor, document) {
    console.log(`Traitement du fichier: ${document.fileName}`);
    const edits = processDocument(document);
    console.log(`${edits.length} modifications trouvées`);
    if (edits.length === 0) {
        console.log("Aucune modification nécessaire");
        return Promise.resolve(false);
    }
    return editor
        .edit((editBuilder) => {
        edits.forEach((edit) => {
            editBuilder.replace(edit.range, edit.newText);
        });
    })
        .then((success) => {
        if (success) {
            vscode.window.showInformationMessage(`${edits.length} valeur(s) en pixels arrondie(s) au multiple de 8`);
        }
        return success;
    });
}
function activate(context) {
    // Commande manuelle
    const disposable = vscode.commands.registerCommand("round-to-8px.roundPixels", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("Aucun éditeur actif");
            return;
        }
        const document = editor.document;
        if (!["css", "scss"].includes(document.languageId)) {
            vscode.window.showWarningMessage("Ce fichier n'est pas un fichier CSS");
            return;
        }
        return applyEdits(editor, document);
    });
    // Écouteur pour la sauvegarde automatique
    const saveDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
        const document = event.document;
        const editor = vscode.window.activeTextEditor;
        console.log(`Événement de sauvegarde déclenché pour: ${document.fileName}`);
        console.log(`Type de document: ${document.languageId}`);
        if (!editor || document !== editor.document) {
            console.log("Aucun éditeur actif ou document non correspondant");
            return;
        }
        const validLanguages = ["css", "scss"];
        if (!validLanguages.includes(document.languageId)) {
            console.log(`Type de document non pris en charge: ${document.languageId}`);
            return;
        }
        console.log("Application des modifications...");
        event.waitUntil(applyEdits(editor, document));
    });
    context.subscriptions.push(disposable, saveDisposable);
}
exports.activate = activate;
function deactivate() {
    // Cette fonction est requise par l'API VSCode
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map