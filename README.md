# Gestion Populations - Commune du Plateau

Application Angular pour la gestion des populations dans la commune du Plateau, Côte d'Ivoire.

## Fonctionnalités

- 📊 **Tableau de bord** : Vue d'ensemble avec statistiques et graphiques
- 👨‍👩‍👧‍👦 **Gestion des familles** : Enregistrement et suivi des familles
- 📍 **Gestion des quartiers** : Organisation territoriale
- 📋 **Gestion des projets** : Suivi des projets communaux
- 👤 **Profil utilisateur** : Gestion du compte utilisateur
- ⚙️ **Paramètres** : Configuration de l'application
- 🔔 **Notifications** : Système de notifications
- 🏷️ **Étiquettes** : Impression d'étiquettes

## Développement

### Prérequis

- Node.js (version 20 ou supérieure)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd gestion-populations

# Installer les dépendances
npm install
```

### Serveur de développement

```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200/`.

### Build

```bash
# Build de production
ng build

# Build pour GitHub Pages
npm run build:gh-pages
```

## Déploiement sur GitHub Pages

Ce projet est configuré pour un déploiement automatique sur GitHub Pages via GitHub Actions.

### Configuration requise

#### Méthode 1 : GitHub Actions (recommandée)

1. **Activer GitHub Pages** dans les paramètres du repository :
   - Aller dans `Settings` > `Pages`
   - Source : **`GitHub Actions`** (importante !)

2. **Pousser le code** sur la branche `main` ou `master`

#### Méthode 2 : Alternative (si la méthode 1 échoue)

Si vous obtenez l'erreur "Pages site failed", utilisez le workflow alternatif :

1. **Activer GitHub Pages** dans les paramètres du repository :
   - Aller dans `Settings` > `Pages`
   - Source : **`Deploy from a branch`**
   - Branch : **`gh-pages`** / (root)

2. **Renommer le workflow principal** :
   ```bash
   # Renommer pour désactiver temporairement
   mv .github/workflows/deploy-github-pages.yml .github/workflows/deploy-github-pages.yml.disabled
   # Activer l'alternatif
   mv .github/workflows/deploy-github-pages-alternative.yml .github/workflows/deploy-github-pages.yml
   ```

3. **Pousser le code** - le workflow créera automatiquement la branche `gh-pages`

### Déploiement automatique

Le workflow GitHub Actions se déclenche automatiquement à chaque push sur `main`/`master` et :

1. ✅ Installe les dépendances
2. ✅ Build l'application avec la configuration GitHub Pages
3. ✅ Crée un fichier `404.html` pour gérer le routage SPA
4. ✅ Déploie sur GitHub Pages

### Accès à l'application

Une fois déployée, l'application sera accessible sur :
```
https://<username>.github.io/gestion-populations/
```

### Résolution des problèmes courants

#### ❌ Erreur "Pages site failed"
- Vérifiez que GitHub Pages est activé dans `Settings` > `Pages`
- Assurez-vous que la source est configurée sur `GitHub Actions`
- Si le problème persiste, utilisez la méthode alternative (voir ci-dessus)

#### ❌ Page blanche ou erreurs 404
- L'application utilise le hash location (`#`) pour éviter les problèmes de routage
- URLs d'exemple : `https://username.github.io/gestion-populations/#/dashboard`

#### ❌ Resources not found
- Vérifiez que `baseHref: "/gestion-populations/"` est correct dans `angular.json`
- Le nom du repository doit correspondre au chemin dans l'URL

### Configuration du domaine personnalisé (optionnel)

Pour utiliser un domaine personnalisé :

1. Décommenter et modifier le fichier `public/CNAME`
2. Configurer le domaine dans les paramètres GitHub Pages

## Technologies utilisées

- **Angular 20** : Framework principal
- **TypeScript** : Langage de programmation
- **Tailwind CSS** : Framework CSS
- **RxJS** : Programmation réactive
- **GitHub Actions** : CI/CD
- **GitHub Pages** : Hébergement

## Structure du projet

```
src/
├── app/
│   ├── components/     # Composants réutilisables
│   ├── pages/         # Pages de l'application
│   ├── services/      # Services Angular
│   ├── models/        # Modèles TypeScript
│   └── directives/    # Directives personnalisées
├── assets/           # Ressources statiques
└── styles.scss      # Styles globaux
```

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
