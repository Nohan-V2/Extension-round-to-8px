import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Extension Test Suite", () => {
  test("Arrondi des valeurs en pixels", async () => {
    // Créer un document de test
    const document = await vscode.workspace.openTextDocument({
      content: `
                .test {
                    width: 15px;
                    height: 23px;
                    margin: 7px;
                    padding: 31px;
                }
            `,
      language: "css",
    });

    // Ouvrir le document
    await vscode.window.showTextDocument(document);

    // Exécuter la commande
    await vscode.commands.executeCommand("round-to-8px.roundPixels");

    // Vérifier le résultat
    const text = document.getText();
    assert.ok(text.includes("width: 16px"));
    assert.ok(text.includes("height: 24px"));
    assert.ok(text.includes("margin: 8px"));
    assert.ok(text.includes("padding: 32px"));
  });

  test("Ne modifie pas les valeurs déjà arrondies", async () => {
    // Créer un document de test
    const document = await vscode.workspace.openTextDocument({
      content: `
                .test {
                    width: 16px;
                    height: 24px;
                    margin: 8px;
                }
            `,
      language: "css",
    });

    // Sauvegarder le contenu original
    const originalText = document.getText();

    // Ouvrir le document
    await vscode.window.showTextDocument(document);

    // Exécuter la commande
    await vscode.commands.executeCommand("round-to-8px.roundPixels");

    // Vérifier que le texte n'a pas changé
    assert.strictEqual(document.getText(), originalText);
  });

  test("Ne modifie pas les fichiers non CSS", async () => {
    // Créer un document de test
    const document = await vscode.workspace.openTextDocument({
      content: `
                const style = {
                    width: '15px',
                    height: '23px'
                };
            `,
      language: "javascript",
    });

    // Sauvegarder le contenu original
    const originalText = document.getText();

    // Ouvrir le document
    await vscode.window.showTextDocument(document);

    // Exécuter la commande
    await vscode.commands.executeCommand("round-to-8px.roundPixels");

    // Vérifier que le texte n'a pas changé
    assert.strictEqual(document.getText(), originalText);
  });
});
