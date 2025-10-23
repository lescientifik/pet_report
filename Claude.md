# Mémoire de projet - Générateur de Comptes Rendus TEP-FDG

**Dernière mise à jour** : 23 octobre 2025
**Version actuelle** : 0.1.0-alpha (Vanilla JS - en cours de refactoring)
**Prochaine version** : 1.0.0 (Vue 3 + Vite)

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

#### Phase 1 : Setup projet ⏳ À FAIRE
**Durée estimée** : 30 min

**Tâches :**
1. Initialiser projet Vite + Vue 3
2. Configurer vite.config.js pour GitHub Pages
3. Créer structure dossiers
4. Setup package.json avec scripts
5. Migrer variables CSS vers assets/styles/
6. Premier commit avec base fonctionnelle

**Commandes :**
```bash
npm create vite@latest . -- --template vue
npm install
npm run dev
```

**Configuration Vite :**
```js
// vite.config.js
export default {
  base: '/pet_report/',
  build: { outDir: 'dist' }
}
```

#### Phase 2 : Composants de base ⏳ À FAIRE
**Durée estimée** : 1h

**Ordre de création :**
1. `App.vue` - Layout principal (header, main, preview)
2. `FormStep.vue` - Wrapper réutilisable pour chaque étape
3. `ButtonGroup.vue` - Composant boutons sélection rapide
4. `Preview.vue` - Zone prévisualisation + bouton copie

#### Phase 3 : Composables (logique métier) ⏳ À FAIRE
**Durée estimée** : 1h

**Ordre de création :**
1. `useReportState.js` - État global avec Composition API
2. `constants.js` - Données statiques (cancers, indications)
3. `useReportGenerator.js` - Génération du texte
4. `useCancerResources.js` - Ressources par cancer
5. `useLocalStorage.js` - Persistance automatique

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
```bash
# Développement local
npm run dev

# Build production
npm run build

# Test build localement
npm run preview

# Déployer sur GitHub Pages
npm run deploy
```

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
