# Test Application

Guide Claude pour tester l'application avec les tests E2E automatisés avant chaque commit.

## Quand utiliser ce skill

- ✅ **OBLIGATOIRE** : Avant chaque commit
- ✅ Après correction de bug
- ✅ Après ajout de fonctionnalité
- ✅ Après refactoring
- ✅ Sur demande explicite de l'utilisateur

## Étapes à suivre

### 1. Lancer les tests E2E

Exécute la commande suivante pour lancer tous les tests :

```bash
npm test
```

Pour des tests plus rapides (smoke test uniquement) :

```bash
npm test quick
```

Pour tester des scénarios spécifiques :

```bash
npm test workflow    # Tests de navigation entre étapes
npm test sections    # Tests des sections anatomiques
npm test lesions     # Tests CRUD des lésions cibles
```

### 2. Analyser les résultats

#### Si tous les tests passent ✅

```
✅ All tests passed (4/4)
```

→ **Commit autorisé**, tu peux procéder.

#### Si des tests échouent ❌

```
❌ Some tests failed (2/4)
📄 Full report: test-report.md
```

→ **NE PAS COMMIT**, suivre les étapes ci-dessous.

### 3. En cas d'échec des tests

1. **Lire le rapport de test** : Utilise l'outil `Read` pour lire `test-report.md` à la racine du projet

2. **Analyser les screenshots** : Si des screenshots existent dans `tests/e2e/screenshots/`, les lire avec l'outil `Read` pour comprendre visuellement l'erreur

3. **Identifier le problème** :
   - Erreurs console (React/Vue warnings, JS errors)
   - Sélecteurs cassés (éléments DOM non trouvés)
   - Réactivité défaillante (état non mis à jour)
   - Navigation conditionnelle incorrecte

4. **Corriger le bug** : Utilise les outils `Edit` ou `Write` pour corriger le code

5. **Re-tester** : Relancer `npm test` jusqu'à ce que tous les tests passent ✅

6. **Commit** : Une fois tous les tests verts, commit les changements

## Tests disponibles

Les tests E2E couvrent :

- **Workflow bilan initial** : Navigation sans étapes traitement/TEP (indication = "bilan")
- **Workflow réévaluation** : Navigation complète avec toutes les étapes
- **Sections anatomiques** : 3 modes (Normal / Anomalie / Lésion cible)
- **Lésions cibles CRUD** : Ajout, édition, suppression de lésions

## Architecture des tests

```
tests/e2e/
├── run-tests.js          # Point d'entrée
├── test-runner.js        # Orchestrateur
├── scenarios/            # Scénarios de test
│   ├── workflow-bilan-extension.js
│   ├── workflow-reevaluation.js
│   ├── sections-anatomiques.js
│   └── lesions-cibles.js
├── utils/                # Utilitaires
│   ├── browser.js        # Puppeteer helpers
│   ├── server.js         # Gestion serveur Vite
│   └── reporter.js       # Génération rapports
└── screenshots/          # Screenshots des échecs
```

## Important

- ⚠️ Les tests lancent automatiquement le serveur Vite si nécessaire
- ⚠️ Les tests s'exécutent en mode headless (navigateur invisible)
- ⚠️ Les screenshots ne sont générés qu'en cas d'échec
- ⚠️ Le rapport `test-report.md` est écrasé à chaque exécution

## Debugging

Si les tests échouent de manière inexpliquée :

1. Vérifier que le serveur Vite démarre correctement : `npm run dev`
2. Vérifier qu'il n'y a pas d'erreurs de build : `npm run build`
3. Vérifier les dépendances : `cd tests/e2e && npm install`
4. Lire les logs complets de la console pendant l'exécution des tests
