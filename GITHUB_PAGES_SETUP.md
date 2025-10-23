# Configuration GitHub Pages

## Problème résolu

La page GitHub Pages affichait une page blanche car elle essayait de servir le code source directement au lieu des fichiers buildés.

## Solution : Utiliser GitHub Actions

Ce projet est configuré pour déployer automatiquement vers GitHub Pages via GitHub Actions.

### Étapes de configuration

1. **Aller dans Settings > Pages** de votre repository GitHub
2. **Source** : Sélectionner "GitHub Actions" (au lieu de "Deploy from a branch")
3. **Save** : Sauvegarder les changements

### Comment ça fonctionne

- Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement à chaque push sur `main`
- Il peut aussi être déclenché manuellement via l'onglet "Actions"
- Le workflow :
  1. Installe les dépendances
  2. Build l'application Vue avec Vite
  3. Déploie le dossier `dist/` vers GitHub Pages

### Déclenchement manuel

Si vous voulez déployer sans faire de commit :

1. Aller dans l'onglet "Actions" du repository
2. Sélectionner "Deploy to GitHub Pages"
3. Cliquer sur "Run workflow"
4. Choisir la branche `main`
5. Cliquer sur "Run workflow"

### Vérification

Après le déploiement, l'application sera accessible à :
`https://lescientifik.github.io/pet_report/`

### Ancienne méthode (gh-pages branch)

La commande `npm run deploy` utilise la branche `gh-pages`, mais cette méthode n'est plus recommandée car elle ne fonctionne pas avec les restrictions de branches Claude.

**Utilisez GitHub Actions à la place.**
