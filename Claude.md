# Mémoire de projet - Générateur de Comptes Rendus TEP-FDG

**Dernière mise à jour** : 23 octobre 2025 - 20:00
**Version actuelle** : 1.0.0-alpha (Vue 3 + Vite - Phase 3 complétée)
**Prochaine version** : 1.0.0 (Vue 3 + Vite - en cours)

> **📝 CONSIGNE IMPORTANTE** : Ce fichier doit être mis à jour à chaque avancée significative du projet (fin de phase, ajout de fonctionnalité majeure, changement architectural, etc.). Toujours mettre à jour la date et l'état d'avancement.

---

## 📅 Journal des modifications

### 23 octobre 2025 - 20:00
**Phase 3 complétée** : Composables (logique métier)
- ✅ utils/constants.js créé (toutes les constantes et options)
- ✅ useReportState.js créé (état global réactif avec pattern singleton)
- ✅ reportFormatter.js créé (fonctions de formatage du texte)
- ✅ useReportGenerator.js créé (génération du rapport en temps réel)
- ✅ useCancerResources.js créé (base de données de ressources médicales)
- ✅ useLocalStorage.js créé (persistance automatique 24h avec auto-save)
- ✅ Build testé : 31.44 KB gzippé (< 200 KB objectif maintenu)
- ✅ Architecture composables complète et modulaire
- 🎯 Prochaine étape : Phase 4 - Formulaires

### 23 octobre 2025 - 19:00
**Phase 2 complétée** : Composants de base
- ✅ ButtonGroup.vue créé (sélection multiple réutilisable)
- ✅ FormStep.vue créé (wrapper pour étapes)
- ✅ Preview.vue créé (prévisualisation + copie presse-papier)
- ✅ AppLayout.vue créé (layout principal responsive)
- ✅ App.vue refactoré avec démo fonctionnelle
- ✅ Build testé : 31.5 KB gzippé (< 200 KB objectif)
- ✅ Navigation entre étapes fonctionnelle
- ✅ Prévisualisation temps réel opérationnelle
- 🎯 Prochaine étape : Phase 3 - Composables (logique métier)

### 23 octobre 2025 - 18:00
**Configuration déploiement automatique**
- ✅ GitHub Actions configuré (.github/workflows/deploy.yml)
- ✅ Déploiement automatique uniquement depuis `main`
- ✅ Stratégie : Chaque PR mergée = déploiement auto
- 📦 URL déploiement : https://lescientifik.github.io/pet_report/
- 🔧 Déclenchement manuel disponible (workflow_dispatch)

### 23 octobre 2025 - 17:30
**Phase 1 complétée** : Setup projet Vue 3 + Vite
- ✅ Architecture moderne mise en place
- ✅ Configuration Vite pour GitHub Pages
- ✅ Structure de dossiers complète
- ✅ Migration CSS (variables + main)
- ✅ Build testé : 27 KB gzippé
- 🎯 Prochaine étape : Phase 2 - Composants de base

### 23 octobre 2025 - 06:16
**Décision architecturale** : Refactoring complet vers Vue 3 + Vite
- ❌ Version Vanilla JS abandonnée (bugs, non maintenable)
- 📝 Documentation complète du plan d'action
- 🏗️ 6 phases d'implémentation planifiées

---

## 📋 Description du projet

### Objectif principal
Créer une application web statique pour **standardiser et accélérer** la rédaction de comptes rendus de TEP-scan au FDG. L'application doit faire gagner du temps par rapport à la dictée vocale et à la saisie manuelle.

### Utilisateur cible
Médecins nucléaires rédigeant des comptes rendus de TEP-scan dans leur logiciel métier.

### Cas d'usage
1. Sélectionner l'indication (bilan initial, réévaluation, surveillance, recherche de récidive)
2. Choisir le type de cancer et détails spécifiques
3. Remplir les informations patient
4. Gérer les comparaisons avec TEP antérieurs
5. Saisir résultats et conclusion
6. Copier le texte généré dans le presse-papier
7. Coller dans le logiciel métier

### Contraintes importantes
- ✅ **Site statique** : Hébergement GitHub Pages, pas de backend
- ✅ **Aucune donnée uploadée** : Tout reste local (RGPD)
- ✅ **Ergonomie prioritaire** : Gain de temps maximal
- ✅ **Extensibilité** : Prévu pour d'autres traceurs (PSMA, FES)

---

## 📊 État actuel du projet

### Version 0.1.0-alpha (Vanilla JS)

**Fichiers actuels :**
- `index.html` - Structure HTML complète
- `style.css` - Styles CSS (design médical épuré)
- `app.js` - Toute la logique JS (700+ lignes, monolithique)
- `README.md` - Documentation utilisateur

**Fonctionnalités implémentées :**
- ✅ Sélection indication (4 choix avec grandes icônes)
- ✅ Sélection cancer (4 fréquents + recherche)
- ✅ Formulaires spécifiques par cancer (sein, ORL, lymphome, mélanome)
- ✅ Informations patient (âge, sexe, traitement, date)
- ✅ Gestion TEP antérieurs (baseline/nadir/contrôle)
- ✅ Résultats et conclusion en texte libre
- ✅ Génération texte en temps réel
- ✅ Copie presse-papier (avec Ctrl+Enter)
- ✅ Sauvegarde localStorage (24h)
- ✅ Volet latéral avec ressources par cancer
- ✅ Navigation clavier

**Cancers pré-configurés :**
1. **Cancer du sein** : côté, histologie, statut RH/HER2, Ki67
2. **Cancer ORL** : topographie (6 sites), sous-localisation, HPV
3. **Lymphome** : type (Hodgkin, LBDGC, etc.), statut
4. **Mélanome** : site primitif, Breslow

**Problèmes identifiés :**
- ❌ **Bug critique** : Formulaires spécifiques ne s'affichent pas
- ❌ Code monolithique (app.js = 700+ lignes)
- ❌ État global manuel difficile à maintenir
- ❌ Manipulation DOM directe partout
- ❌ Difficulté d'ajouter de nouveaux cancers
- ❌ Pas de modularité pour extension multi-traceurs
- ❌ Maintenance complexe

**Décision** : Refactoring complet vers architecture moderne

---

## 🏗️ Plan d'action : Refactoring Vue 3 + Vite

### Décision architecturale

**Framework choisi : Vue.js 3 + Vite**

**Justification :**
- ✅ Ni trop lourd (~40KB) ni trop léger
- ✅ Composition API pour modularité
- ✅ Réactivité native parfaite pour formulaires
- ✅ Compatible GitHub Pages (build statique)
- ✅ Vite = dev ultra-rapide + build optimisé
- ✅ Extensibilité multi-traceurs
- ✅ Documentation française excellente

**Alternatives rejetées :**
- ❌ React : Plus lourd, moins adapté aux formulaires
- ❌ Alpine.js : Trop léger pour ce projet
- ❌ Svelte : Moins mature, écosystème plus petit
- ❌ Vanilla JS : Déjà testé, non maintenable

### Architecture cible

```
pet_report/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── IndicationSelector.vue
│   │   │   ├── CancerSelector.vue
│   │   │   ├── cancer-specific/
│   │   │   │   ├── SeinForm.vue
│   │   │   │   ├── OrlForm.vue
│   │   │   │   ├── LymphomeForm.vue
│   │   │   │   ├── MelanomeForm.vue
│   │   │   ├── PatientInfo.vue
│   │   │   ├── TepComparison.vue
│   │   │   ├── ResultsForm.vue
│   │   │   ├── ConclusionForm.vue
│   │   ├── ui/
│   │   │   ├── Preview.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── ButtonGroup.vue
│   │   │   ├── FormStep.vue
│   ├── composables/
│   │   ├── useReportState.js         # État global réactif
│   │   ├── useReportGenerator.js     # Génération texte
│   │   ├── useCancerResources.js     # Ressources par cancer
│   │   ├── useLocalStorage.js        # Persistance
│   │   ├── useKeyboardShortcuts.js   # Raccourcis clavier
│   ├── utils/
│   │   ├── reportFormatter.js        # Formatage texte
│   │   ├── constants.js              # Cancers, indications
│   │   ├── validators.js             # Validation
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   ├── variables.css
│   ├── App.vue
│   ├── main.js
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

### Phases d'implémentation

#### Phase 1 : Setup projet ✅ TERMINÉE
**Durée réelle** : 30 min
**Statut** : Complété le 23 octobre 2025
**Commit** : `bf8fb5e` - Phase 1 : Setup projet Vue 3 + Vite

**Réalisations :**
1. ✅ Projet Vite + Vue 3 initialisé
2. ✅ vite.config.js configuré (base: '/pet_report/', alias @, vendor chunks)
3. ✅ Structure complète des dossiers créée
4. ✅ package.json avec scripts (dev, build, preview, deploy)
5. ✅ CSS migré vers assets/styles/ (variables.css + main.css)
6. ✅ Fichiers de base créés (App.vue, main.js, index.html)
7. ✅ Ancienne version sauvegardée (*.old.*)
8. ✅ Build testé : ~27 KB gzippé ✅

**Résultat :**
```
src/
├── components/forms/cancer-specific/
├── components/ui/
├── composables/
├── utils/
├── assets/styles/
├── App.vue (page de statut temporaire)
└── main.js
```

#### Phase 2 : Composants de base ✅ TERMINÉE
**Durée estimée** : 1h
**Durée réelle** : 45 min
**Statut** : Complété le 23 octobre 2025
**Commit** : `2750975` - Phase 2 : Composants de base - Implémentation complète

**Réalisations :**
1. ✅ `ButtonGroup.vue` - Composant réutilisable pour sélection multiple avec v-model
2. ✅ `FormStep.vue` - Wrapper simple pour gérer l'affichage conditionnel des étapes
3. ✅ `Preview.vue` - Zone de prévisualisation avec copie presse-papier et Ctrl+Enter
4. ✅ `AppLayout.vue` - Layout principal avec grille responsive (2 colonnes sur desktop)
5. ✅ `App.vue` - Refactoré avec démo fonctionnelle des composants
6. ✅ Navigation entre étapes implémentée
7. ✅ Prévisualisation temps réel fonctionnelle
8. ✅ Build testé : 31.5 KB gzippé (objectif < 200 KB atteint)

**Résultat :**
```
src/components/ui/
├── AppLayout.vue (Layout principal)
├── ButtonGroup.vue (Sélection multiple)
├── FormStep.vue (Wrapper étapes)
└── Preview.vue (Prévisualisation + copie)
```

#### Phase 3 : Composables (logique métier) ✅ TERMINÉE
**Durée estimée** : 1h
**Durée réelle** : 45 min
**Statut** : Complété le 23 octobre 2025
**Commit** : À venir - Phase 3 : Composables - Logique métier complète

**Réalisations :**
1. ✅ `utils/constants.js` - Toutes les constantes (indications, cancers, options par cancer)
2. ✅ `composables/useReportState.js` - État global réactif avec pattern singleton
3. ✅ `utils/reportFormatter.js` - Fonctions de formatage du texte par section
4. ✅ `composables/useReportGenerator.js` - Génération du rapport en temps réel
5. ✅ `composables/useCancerResources.js` - Base de données de ressources médicales
6. ✅ `composables/useLocalStorage.js` - Persistance automatique avec auto-save
7. ✅ Build testé : 31.44 KB gzippé (objectif < 200 KB maintenu)

**Résultat :**
```
src/
├── composables/
│   ├── useReportState.js (État global singleton)
│   ├── useReportGenerator.js (Génération texte)
│   ├── useCancerResources.js (Ressources médicales)
│   └── useLocalStorage.js (Persistance 24h)
└── utils/
    ├── constants.js (Toutes les constantes)
    └── reportFormatter.js (Formatage texte)
```

#### Phase 4 : Formulaires ⏳ À FAIRE
**Durée estimée** : 2h

**Ordre de création :**
1. `IndicationSelector.vue` (étape 1)
2. `CancerSelector.vue` (étape 2)
3. Formulaires spécifiques (étape 2b) :
   - `SeinForm.vue`
   - `OrlForm.vue`
   - `LymphomeForm.vue`
   - `MelanomeForm.vue`
4. `PatientInfo.vue` (étape 3)
5. `TepComparison.vue` (étape 4)
6. `ResultsForm.vue` (étape 5)
7. `ConclusionForm.vue` (étape 6)

#### Phase 5 : Features avancées ⏳ À FAIRE
**Durée estimée** : 1h

**Tâches :**
1. `Sidebar.vue` - Volet contextuel avec ressources
2. `useKeyboardShortcuts.js` - Ctrl+Enter, Esc, Tab
3. Feedback visuels (copie, sauvegarde)
4. Animations CSS

#### Phase 6 : Build & Deploy ⏳ À FAIRE
**Durée estimée** : 30 min

**Tâches :**
1. Test build production
2. Optimisation bundle
3. Script deploy GitHub Pages
4. Documentation README mise à jour
5. Migration données de l'ancienne version

**Total estimé : 6h**

---

## 💻 Recommandations de développement

### Principes généraux

1. **Un composant = une responsabilité**
   - Petit, focalisé, réutilisable
   - Max 150 lignes par composant

2. **Composition API uniquement**
   - Pas d'Options API
   - Utiliser `<script setup>`

3. **Props typage strict**
   - Toujours définir `defineProps` avec types
   - Utiliser `defineEmits` pour events

4. **État centralisé**
   - Pas de prop drilling
   - Utiliser composables pour état partagé

5. **Nommage cohérent**
   - Composants : PascalCase (ex: `ButtonGroup.vue`)
   - Composables : camelCase avec préfixe `use` (ex: `useReportState.js`)
   - Constantes : UPPER_SNAKE_CASE

### Architecture composables

#### useReportState.js - État global
```js
import { ref, reactive, computed } from 'vue'

export function useReportState() {
  // État
  const indication = ref('')
  const cancer = ref('')
  const cancerDetails = reactive({})
  const age = ref('')
  const sexe = ref('')
  const traitement = ref('')
  const dateTraitement = ref('')
  const comparaisons = ref([])
  const resultats = ref('')
  const conclusion = ref('')

  // Computed
  const isComplete = computed(() => {
    return indication.value && cancer.value && age.value
  })

  // Actions
  function reset() {
    indication.value = ''
    cancer.value = ''
    Object.keys(cancerDetails).forEach(key => delete cancerDetails[key])
    // ... reset autres champs
  }

  return {
    // État
    indication,
    cancer,
    cancerDetails,
    age,
    sexe,
    traitement,
    dateTraitement,
    comparaisons,
    resultats,
    conclusion,
    // Computed
    isComplete,
    // Actions
    reset
  }
}
```

#### useReportGenerator.js - Génération texte
```js
import { computed } from 'vue'
import { useReportState } from './useReportState'
import { buildIndicationText, buildResultsText, buildConclusionText } from '../utils/reportFormatter'

export function useReportGenerator() {
  const state = useReportState()

  const report = computed(() => {
    let text = ''

    // Indication
    if (state.isComplete.value) {
      text += buildIndicationText(state)
      text += '\n\n'
    }

    // Résultats
    if (state.resultats.value || state.comparaisons.value.length > 0) {
      text += buildResultsText(state)
      text += '\n\n'
    }

    // Conclusion
    if (state.conclusion.value) {
      text += buildConclusionText(state)
    }

    return text
  })

  return { report }
}
```

### Structure d'un composant formulaire

#### Exemple : SeinForm.vue
```vue
<script setup>
import { useReportState } from '@/composables/useReportState'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { cancerDetails } = useReportState()

const coteOptions = [
  { value: 'gauche', label: 'Gauche' },
  { value: 'droit', label: 'Droit' },
  { value: 'bilatéral', label: 'Bilatéral' }
]

const histologieOptions = [
  { value: 'canalaire', label: 'Canalaire' },
  { value: 'lobulaire', label: 'Lobulaire' },
  { value: 'autre', label: 'Autre' }
]

const statutOptions = [
  { value: 'RH+', label: 'RH+' },
  { value: 'HER2+', label: 'HER2+' },
  { value: 'triple négatif', label: 'Triple négatif' }
]
</script>

<template>
  <div class="sein-form">
    <div class="form-section">
      <label class="section-label">Côté</label>
      <ButtonGroup
        v-model="cancerDetails.cote"
        :options="coteOptions"
      />
    </div>

    <div class="form-section">
      <label class="section-label">Type histologique (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.histologie"
        :options="histologieOptions"
      />
    </div>

    <div class="form-section">
      <label class="section-label">Statut (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.statut"
        :options="statutOptions"
      />
    </div>

    <div class="form-group">
      <label for="ki67">Ki67 (optionnel)</label>
      <input
        id="ki67"
        v-model="cancerDetails.ki67"
        type="text"
        placeholder="Ex: 30%"
      >
    </div>
  </div>
</template>

<style scoped>
.sein-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
```

### Gestion des constantes

#### utils/constants.js
```js
export const INDICATIONS = [
  { value: 'bilan', label: 'Bilan initial', icon: '🔍' },
  { value: 'reevaluation', label: 'Réévaluation', icon: '📈' },
  { value: 'surveillance', label: 'Surveillance', icon: '👁️' },
  { value: 'recidive', label: 'Recherche de récidive', icon: '🔎' }
]

export const CANCERS_FREQUENTS = [
  { value: 'cancer du sein', label: 'Sein', icon: '🎗️' },
  { value: 'mélanome', label: 'Mélanome', icon: '⚫' },
  { value: 'cancer ORL', label: 'ORL', icon: '👤' },
  { value: 'lymphome', label: 'Lymphome', icon: '🩸' }
]

export const CANCER_FORM_MAP = {
  'cancer du sein': 'SeinForm',
  'mélanome': 'MelanomeForm',
  'cancer ORL': 'OrlForm',
  'cancer orl': 'OrlForm',
  'lymphome': 'LymphomeForm'
}

export const TEP_TYPES = [
  { value: 'baseline', label: 'Baseline' },
  { value: 'nadir', label: 'Nadir' },
  { value: 'controle', label: 'Contrôle' }
]
```

### LocalStorage avec Vue

#### useLocalStorage.js
```js
import { watch } from 'vue'
import { useReportState } from './useReportState'

export function useLocalStorage() {
  const state = useReportState()
  const STORAGE_KEY = 'petReportState'
  const EXPIRY_HOURS = 24

  // Sauvegarde automatique
  watch(
    () => ({ ...state }),
    (newState) => {
      const data = {
        state: newState,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },
    { deep: true }
  )

  // Chargement initial
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return

      const { state: savedState, timestamp } = JSON.parse(saved)

      // Vérifier expiration
      const now = Date.now()
      const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000
      if (now - timestamp > expiryMs) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      // Restaurer état
      Object.assign(state, savedState)
    } catch (e) {
      console.error('Erreur chargement localStorage:', e)
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { load, clear }
}
```

### Déploiement GitHub Pages

#### package.json
```json
{
  "name": "pet-report",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && touch dist/.nojekyll && gh-pages -d dist -t true"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "gh-pages": "^6.1.0",
    "vite": "^5.0.0"
  }
}
```

#### vite.config.js
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/pet_report/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue']
        }
      }
    }
  }
})
```

#### Workflow déploiement

**Déploiement automatique via GitHub Actions :**
- ✅ Configuré dans `.github/workflows/deploy.yml`
- ✅ Se déclenche automatiquement sur push vers `main`
- ✅ Workflow : PR mergée → Build auto → Déploiement auto
- ✅ URL de production : https://lescientifik.github.io/pet_report/

**Développement local :**
```bash
# Développement local
npm run dev

# Build production
npm run build

# Test build localement
npm run preview
```

**Déploiement manuel (si nécessaire) :**
- Via GitHub UI : Actions → Deploy to GitHub Pages → Run workflow
- Le déploiement automatique rend cette option rarement nécessaire

**Stratégie de déploiement :**
1. Développement sur branche `claude/*`
2. Création d'une Pull Request
3. Merge vers `main` → **Déploiement automatique**
4. Chaque phase = 1 PR = 1 déploiement

---

## 🎯 Objectifs de qualité

### Performance
- ⚡ First Contentful Paint < 1s
- ⚡ Time to Interactive < 2s
- 📦 Bundle size total < 200KB gzipped

### Accessibilité
- ♿ Navigation clavier complète
- ♿ Labels ARIA appropriés
- ♿ Contraste WCAG AA minimum

### Maintenabilité
- 📝 Chaque composant < 150 lignes
- 📝 Chaque fonction < 50 lignes
- 📝 Pas de duplication de code
- 📝 Nommage explicite

---

## 🚀 Extensions futures

### Version 1.1 : Amélioration UX
- Auto-suggestions dans résultats
- Templates pré-remplis par cancer
- Historique 10 derniers CR
- Export PDF optionnel

### Version 2.0 : Multi-traceurs
- Sélecteur traceur (FDG / PSMA / FES)
- Formulaires spécifiques PSMA (prostate)
- Formulaires spécifiques FES (sein)
- Architecture avec dossiers par traceur

### Version 3.0 : Features avancées
- Mode collaboratif (partage templates)
- Statistiques personnelles
- Intégration IA (suggestions)
- Mode hors ligne (PWA)

---

## 📝 Notes importantes pour reprise

### Points d'attention

1. **Ne PAS reprendre le code vanilla JS actuel**
   - Présence de bugs non résolus
   - Architecture non maintenable
   - Partir de zéro avec Vue 3

2. **Respecter l'ordre des phases**
   - Phase 1 (Setup) AVANT tout le reste
   - Composables AVANT composants
   - Ne pas sauter d'étapes

3. **Test au fur et à mesure**
   - Tester chaque composant individuellement
   - Vérifier réactivité Vue
   - Valider génération texte à chaque étape

4. **Commits atomiques**
   - 1 commit = 1 fonctionnalité
   - Messages descriptifs
   - Pusher régulièrement

### Commandes utiles

```bash
# Démarrer développement
cd pet_report
npm install
npm run dev

# Créer nouveau composant
touch src/components/forms/NouveauComposant.vue

# Build et déployer
npm run deploy

# Voir l'app déployée
open https://lescientifik.github.io/pet_report/
```

### En cas de blocage

1. **Vérifier vite.config.js** : base path correct
2. **Vérifier imports** : alias `@` configuré
3. **Console navigateur** : erreurs Vue explicites
4. **Réactivité** : utiliser `ref()` pour primitives, `reactive()` pour objets
5. **Props** : toujours définir avec `defineProps`

---

## 📞 Informations contextuelles

### Utilisateur
Médecin nucléaire, pratique quotidienne TEP-scan FDG

### Cancers prioritaires
1. Sein (le plus fréquent)
2. ORL
3. Lymphome
4. Mélanome

### Format de sortie
Texte plat copié dans presse-papier, structuré en 3 sections :
```
INDICATION
[texte généré]

RÉSULTATS
[comparaison TEP antérieurs optionnelle]
[résultats saisis]

CONCLUSION
[conclusion saisie]
```

### Contraintes légales
- Pas de stockage distant (RGPD)
- Pas de données patient identifiantes
- LocalStorage = 24h max

---

**FIN DU DOCUMENT**

_Ce fichier doit être mis à jour à chaque avancée majeure du projet._
