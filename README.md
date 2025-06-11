# Round to 8px

Arrondit automatiquement les valeurs CSS en pixels au multiple de 8 le plus proche (ou 4 si besoin) dans vos fichiers CSS/SCSS.

## ✨ Fonctionnalités

- Arrondit toutes les valeurs en `px` pour les propriétés de type margin, padding, gap, etc. au multiple de 8 le plus proche (ou 4 si plus pertinent)
- Fonctionne sur les fichiers `.css` et `.scss`
- Commande manuelle et arrondi automatique à la sauvegarde

## 🛠️ Prérequis

- [Visual Studio Code](https://code.visualstudio.com/) version 1.60.0 ou plus récente

## 📦 Installation

1. **Téléchargez le fichier `.vsix`**
   - Exemple : `round-to-8px-0.1.0.vsix` présent dans ce dépôt ou généré via la commande `vsce package`
2. **Installez l’extension dans VS Code** :
   - Ouvrez la palette de commandes (`Ctrl+Shift+P`)
   - Tapez `Extensions: Installer depuis un VSIX...`
   - Sélectionnez votre fichier `.vsix`
3. **Redémarrez VS Code** si nécessaire

## 🚀 Utilisation

- **Commande manuelle** :
  - Ouvrez un fichier CSS/SCSS
  - Ouvrez la palette de commandes (`Ctrl+Shift+P`)
  - Cherchez `Arrondir les pixels au multiple de 8`
  - La commande va arrondir toutes les valeurs concernées du fichier
- **À la sauvegarde** :
  - L’extension peut aussi arrondir automatiquement à la sauvegarde selon la configuration (voir le code source pour activer/désactiver cette fonctionnalité)

## 🧩 Commande disponible

- `round-to-8px.roundPixels` : Arrondit toutes les valeurs en pixels au multiple de 8 ou 4 dans le fichier courant

## 📝 Contribution

Les contributions sont les bienvenues !

- Forkez le dépôt
- Créez une branche
- Faites vos modifications
- Ouvrez une Pull Request

## 📄 Licence

ISC

---

**Auteur :** NohanV2

Pour toute question, ouvrez une issue sur GitHub.
