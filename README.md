# Round to 8px

[![Version](https://vsmarketplacebadge.apphb.com/version/round-to-8px.svg)](https://marketplace.visualstudio.com/items?itemName=round-to-8px)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/round-to-8px.svg)](https://marketplace.visualstudio.com/items?itemName=round-to-8px)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/round-to-8px.svg)](https://marketplace.visualstudio.com/items?itemName=round-to-8px)

Une extension VSCode qui arrondit automatiquement les valeurs CSS en pixels, en privilégiant les multiples de 8 et en utilisant les multiples de 4 si nécessaire. Cette approche suit les bonnes pratiques de design system pour une mise en page cohérente et harmonieuse.

## ✨ Fonctionnalités

- 🔍 Détection automatique des valeurs en pixels dans les fichiers CSS, SCSS et LESS
- 🔢 Arrondi automatique en privilégiant les multiples de 8, avec repli sur les multiples de 4 si nécessaire
- ⚡ Traitement rapide du fichier actif
- 🎨 Support complet des fichiers CSS, SCSS et LESS
- 🔄 Conservation du formatage et des commentaires

## 🚀 Installation

1. Ouvrez VSCode
2. Appuyez sur `Ctrl+Shift+X` (ou `Cmd+Shift+X` sur Mac) pour ouvrir le gestionnaire d'extensions
3. Recherchez "Round to 8px"
4. Cliquez sur "Installer"

## 🛠 Utilisation

### Méthode 1 : Palette de commandes
1. Ouvrez un fichier CSS, SCSS ou LESS
2. Appuyez sur `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur Mac)
3. Tapez "Arrondir les pixels au multiple de 8"
4. Appuyez sur Entrée

### Méthode 2 : Raccourci clavier
1. Ouvrez un fichier CSS, SCSS ou LESS
2. Appuyez sur `Ctrl+Alt+8` (ou `Cmd+Option+8` sur Mac)

## 📝 Exemples

```css
/* Avant */
.element {
  width: 15px;    /* 16px (multiple de 8) */
  height: 23px;   /* 24px (multiple de 8) */
  margin: 7px;    /* 8px (multiple de 8) */
  padding: 3px 11px;  /* 4px 12px (multiples de 4) */
  font-size: 15px;  /* 16px (multiple de 8) */
  border-radius: 5px;  /* 4px (multiple de 4) */
}

/* Après */
.element {
  width: 16px;
  height: 24px;
  margin: 8px;
  padding: 4px 12px;
  font-size: 16px;
  border-radius: 4px;
}
```

### Comportement d'arrondi

- **Privilégie les multiples de 8** : Si la différence avec le multiple de 8 le plus proche est de 4px ou moins
- **Utilise les multiples de 4** : Si la différence avec le multiple de 8 le plus proche est supérieure à 4px
- **Exemples** :
  - 5px → 4px (multiple de 4)
  - 6px → 8px (multiple de 8, différence de 2px)
  - 10px → 8px (multiple de 8, différence de 2px)
  - 14px → 16px (multiple de 8, différence de 2px)
  - 18px → 16px (multiple de 8, différence de 2px)
  - 19px → 20px (multiple de 4, car la différence avec 16 serait de 3, mais avec 24 serait de 5)

## 🛠 Développement

### Prérequis
- Node.js
- npm
- Visual Studio Code

### Installation en mode développement

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/round-to-8px.git
cd round-to-8px

# Installer les dépendances
npm install

# Compiler l'extension
npm run compile

# Lancer VSCode en mode debug
code .
```

### Commandes disponibles

- `npm install` - Installe les dépendances
- `npm run compile` - Compile l'extension
- `npm run watch` - Compile l'extension en mode watch
- `npm run lint` - Vérifie le code avec ESLint
- `npm test` - Exécute les tests

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
