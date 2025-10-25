# Tests E2E - Pet Report

Tests end-to-end automatisés pour l'application Pet Report, utilisant Puppeteer.

## Installation

```bash
cd tests/e2e
npm install
```

## Lancer les tests

Depuis la racine du projet :

```bash
# Tous les tests (recommandé avant commit)
npm test

# Test rapide (smoke test ~10s)
npm test quick

# Tests par catégorie
npm test workflow    # Navigation entre étapes
npm test sections    # Sections anatomiques
npm test lesions     # CRUD lésions cibles
```

Ou directement depuis ce dossier :

```bash
node run-tests.js [scenario]
```

## Scénarios de test

### 1. Workflow : Bilan d'extension
**Fichier** : `scenarios/workflow-bilan-extension.js`

Teste le workflow conditionnel lorsque l'indication est "bilan initial" :
- ✅ Saisie informations patient (âge, sexe)
- ✅ Sélection indication "Bilan initial"
- ✅ Sélection cancer
- ✅ Vérification que l'étape "Traitement" est **skip**
- ✅ Vérification que l'étape "TEP antérieurs" est **skip**
- ✅ Navigation directe vers "Résultats"
- ✅ Génération preview

### 2. Workflow : Réévaluation
**Fichier** : `scenarios/workflow-reevaluation.js`

Teste le workflow complet avec toutes les étapes :
- ✅ Informations patient
- ✅ Indication "Réévaluation"
- ✅ Cancer
- ✅ **Étape traitement** (apparaît)
- ✅ **Étape TEP antérieurs** (apparaît)
- ✅ Résultats
- ✅ Conclusion

### 3. Sections anatomiques
**Fichier** : `scenarios/sections-anatomiques.js`

Teste les 3 modes de saisie des sections :
- ✅ Mode "Normal" (phrase type auto)
- ✅ Mode "Anomalie" (saisie texte libre)
- ✅ Mode "Lésion cible" (formulaire structuré)
- ✅ Changement de section (onglets)
- ✅ Génération preview pour chaque mode

### 4. Lésions cibles CRUD
**Fichier** : `scenarios/lesions-cibles.js`

Teste les opérations sur les lésions cibles :
- ✅ Ajout lésion (localisation, SUVmax, volume)
- ✅ Édition lésion
- ✅ Suppression lésion
- ✅ Vérification preview
- ✅ Compteur de lésions

## Structure

```
tests/e2e/
├── run-tests.js          # Point d'entrée
├── test-runner.js        # Orchestrateur de tests
├── package.json          # Dépendances (Puppeteer)
├── scenarios/            # Scénarios de test
│   ├── workflow-bilan-extension.js
│   ├── workflow-reevaluation.js
│   ├── sections-anatomiques.js
│   └── lesions-cibles.js
├── utils/                # Utilitaires
│   ├── browser.js        # Helpers Puppeteer
│   ├── server.js         # Gestion serveur Vite
│   └── reporter.js       # Génération rapports Markdown
└── screenshots/          # Screenshots en cas d'échec
```

## Rapport de test

Après chaque exécution, un rapport Markdown est généré à la racine :

```
test-report.md
```

Le rapport contient :
- ✅ Résumé (passed/failed)
- 📸 Screenshots des échecs
- 🐛 Erreurs console détectées
- 💡 Suggestions de correction

## Debugging

Si un test échoue :

1. **Lire le rapport** : `cat test-report.md`
2. **Voir les screenshots** : `tests/e2e/screenshots/*.png`
3. **Logs console** : Les erreurs JS/Vue sont capturées automatiquement
4. **Mode visible** : Modifier `headless: false` dans `utils/browser.js`

## Intégration CI/CD

Ces tests peuvent être intégrés dans GitHub Actions :

```yaml
- name: Run E2E tests
  run: |
    npm install
    npm run dev &
    sleep 5
    npm test
```

## Maintenance

### Ajouter un nouveau scénario

1. Créer `scenarios/mon-test.js`
2. Exporter une fonction async :
   ```javascript
   export async function testMonFeature(page, reporter) {
     try {
       // Test logic
       await page.click('[data-testid="mon-element"]')
       reporter.recordPass('Mon test')
     } catch (error) {
       reporter.recordFailure('Mon test', error)
       throw error
     }
   }
   ```
3. L'ajouter dans `test-runner.js` :
   ```javascript
   import { testMonFeature } from './scenarios/mon-test.js'

   const SCENARIOS = {
     all: [..., testMonFeature]
   }
   ```

### Utiliser data-testid

Pour faciliter les tests, ajouter `data-testid` aux éléments clés :

```vue
<button data-testid="btn-next-step">Suivant</button>
```

Puis dans les tests :

```javascript
await page.click('[data-testid="btn-next-step"]')
```

## Dépendances

- **Puppeteer** : Automatisation navigateur Chrome headless
- **Vite** : Serveur dev (doit être démarré)

## Notes

- Les tests démarrent automatiquement le serveur Vite si besoin
- Mode headless par défaut (navigateur invisible)
- Screenshots uniquement en cas d'échec (économise espace)
- Timeout global : 2 minutes par test
