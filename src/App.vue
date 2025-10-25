<script setup>
import { computed, onMounted } from 'vue'
import { useReportState } from '@/composables/useReportState'
import { useReportGenerator } from '@/composables/useReportGenerator'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { CANCER_FORM_MAP } from '@/utils/constants'

import AppLayout from '@/components/ui/AppLayout.vue'
import FormStep from '@/components/ui/FormStep.vue'
import Preview from '@/components/ui/Preview.vue'

// Formulaires étapes
import PatientBasicInfo from '@/components/forms/PatientBasicInfo.vue'
import IndicationSelector from '@/components/forms/IndicationSelector.vue'
import CancerSelector from '@/components/forms/CancerSelector.vue'
import TreatmentInfo from '@/components/forms/TreatmentInfo.vue'
import TepComparison from '@/components/forms/TepComparison.vue'
import ResultsEditor from '@/components/forms/results/ResultsEditor.vue'
import ConclusionForm from '@/components/forms/ConclusionForm.vue'

// Formulaires spécifiques cancer
import SeinForm from '@/components/forms/cancer-specific/SeinForm.vue'
import OrlForm from '@/components/forms/cancer-specific/OrlForm.vue'
import LymphomeForm from '@/components/forms/cancer-specific/LymphomeForm.vue'
import MelanomeForm from '@/components/forms/cancer-specific/MelanomeForm.vue'

// État et génération
const state = useReportState()
const { report } = useReportGenerator()
const storage = useLocalStorage()

// Charger les données sauvegardées au démarrage et activer l'auto-save
onMounted(() => {
  storage.load()
  storage.enableAutoSave()
})

// Détermine quel formulaire cancer afficher
const cancerFormComponent = computed(() => {
  const formName = CANCER_FORM_MAP[state.cancer.value?.toLowerCase()]

  switch (formName) {
    case 'SeinForm':
      return SeinForm
    case 'OrlForm':
      return OrlForm
    case 'LymphomeForm':
      return LymphomeForm
    case 'MelanomeForm':
      return MelanomeForm
    default:
      return null
  }
})

// ===== LOGIQUE CONDITIONNELLE =====

// Détermine si c'est un bilan initial (pas de traitement nécessaire)
const isInitialWorkup = computed(() => {
  return state.indication.value === 'bilan'
})

// Détermine si l'étape traitement doit être affichée
const shouldShowTreatment = computed(() => {
  return !isInitialWorkup.value
})

// Détermine si l'étape TEP antérieurs doit être affichée
const shouldShowTepComparison = computed(() => {
  return !isInitialWorkup.value
})

// Calcul dynamique du nombre total d'étapes
const totalSteps = computed(() => {
  let steps = 6 // Base: Patient, Indication, Cancer, Résultats, Conclusion = 5
  if (shouldShowTreatment.value) steps++ // +1 pour Traitement
  if (shouldShowTepComparison.value) steps++ // +1 pour TEP antérieurs
  return steps
})

// Mapping des étapes physiques aux étapes logiques
const stepMapping = computed(() => {
  const mapping = [
    { step: 1, name: 'patient-basic', title: 'Informations patient' },
    { step: 2, name: 'indication', title: 'Indication' },
    { step: 3, name: 'cancer', title: 'Type de cancer' }
  ]

  let currentStep = 4

  if (shouldShowTreatment.value) {
    mapping.push({ step: currentStep++, name: 'treatment', title: 'Traitement' })
  }

  if (shouldShowTepComparison.value) {
    mapping.push({ step: currentStep++, name: 'tep-comparison', title: 'TEP antérieurs (optionnel)' })
  }

  mapping.push({ step: currentStep++, name: 'results', title: 'Résultats' })
  mapping.push({ step: currentStep++, name: 'conclusion', title: 'Conclusion' })

  return mapping
})

// Obtenir le nom de l'étape courante
const currentStepName = computed(() => {
  const step = stepMapping.value.find(s => s.step === state.currentStep.value)
  return step ? step.name : ''
})

// Obtenir le titre de l'étape courante
const currentStepTitle = computed(() => {
  const step = stepMapping.value.find(s => s.step === state.currentStep.value)
  return step ? step.title : ''
})

// ===== VALIDATION =====

const canGoToStep2 = computed(() => {
  // Étape 1 (patient-basic) → 2 (indication) : âge et sexe requis
  return state.age.value && state.sexe.value
})

const canGoToStep3 = computed(() => {
  // Étape 2 (indication) → 3 (cancer) : indication requise
  return state.indication.value
})

const canGoToStep4 = computed(() => {
  // Étape 3 (cancer) → 4 (treatment ou tep-comparison ou results) : cancer requis
  return state.cancer.value
})

const canGoToTreatment = computed(() => {
  // Si l'étape traitement existe, au moins 1 traitement requis
  return state.hasTraitements.value
})

// Validation pour bouton "Suivant"
const canGoNext = computed(() => {
  const step = state.currentStep.value

  if (step === 1) return canGoToStep2.value
  if (step === 2) return canGoToStep3.value
  if (step === 3) return canGoToStep4.value

  // Si on est sur l'étape traitement, vérifier que traitement et date sont remplis
  if (currentStepName.value === 'treatment') {
    return canGoToTreatment.value
  }

  // Pour les autres étapes, toujours permettre de continuer
  return true
})

// ===== NAVIGATION =====

function nextStep() {
  if (!canGoNext.value) return

  // Si on est à l'étape 3 (cancer) et qu'il n'y a pas d'étape traitement, sauter directement à results
  if (state.currentStep.value === 3 && !shouldShowTreatment.value && !shouldShowTepComparison.value) {
    // Trouver l'étape "results"
    const resultsStep = stepMapping.value.find(s => s.name === 'results')
    if (resultsStep) {
      state.currentStep.value = resultsStep.step
      return
    }
  }

  state.nextStep()
}

function prevStep() {
  // Si on est sur results et qu'il n'y a pas d'étape traitement ni tep-comparison, revenir à cancer
  if (currentStepName.value === 'results' && !shouldShowTreatment.value && !shouldShowTepComparison.value) {
    state.currentStep.value = 3 // cancer
    return
  }

  state.prevStep()
}

// Réinitialiser
function resetForm() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
    state.reset()
    storage.clear()
  }
}
</script>

<template>
  <AppLayout>
    <!-- Formulaires -->
    <template #form>
      <div class="form-container">
        <!-- Header avec navigation -->
        <div class="form-header">
          <h1 class="form-title">Générateur de Comptes Rendus TEP-FDG</h1>
          <div class="step-indicator">
            Étape {{ state.currentStep.value }} / {{ totalSteps }}
          </div>
        </div>

        <!-- Étape 1 : Informations patient (âge + sexe) -->
        <FormStep
          :active="state.currentStep.value === 1"
          title="Étape 1 : Informations patient"
        >
          <PatientBasicInfo />
        </FormStep>

        <!-- Étape 2 : Indication -->
        <FormStep
          :active="state.currentStep.value === 2"
          title="Étape 2 : Indication"
        >
          <IndicationSelector />
        </FormStep>

        <!-- Étape 3 : Type de cancer + formulaire spécifique -->
        <FormStep
          :active="state.currentStep.value === 3"
          title="Étape 3 : Type de cancer"
        >
          <div class="step-content">
            <CancerSelector />

            <!-- Formulaire spécifique au cancer -->
            <div v-if="cancerFormComponent" class="cancer-specific-form">
              <component :is="cancerFormComponent" />
            </div>
          </div>
        </FormStep>

        <!-- Étape 4 (conditionnelle) : Traitement -->
        <FormStep
          v-if="shouldShowTreatment"
          :active="currentStepName === 'treatment'"
          :title="`Étape ${stepMapping.find(s => s.name === 'treatment')?.step} : Traitement`"
        >
          <TreatmentInfo />
        </FormStep>

        <!-- Étape 5 (conditionnelle) : Comparaisons TEP -->
        <FormStep
          v-if="shouldShowTepComparison"
          :active="currentStepName === 'tep-comparison'"
          :title="`Étape ${stepMapping.find(s => s.name === 'tep-comparison')?.step} : TEP antérieurs (optionnel)`"
        >
          <TepComparison />
        </FormStep>

        <!-- Étape 6 : Résultats -->
        <FormStep
          :active="currentStepName === 'results'"
          :title="`Étape ${stepMapping.find(s => s.name === 'results')?.step} : Résultats`"
        >
          <ResultsEditor />
        </FormStep>

        <!-- Étape 7 : Conclusion -->
        <FormStep
          :active="currentStepName === 'conclusion'"
          :title="`Étape ${stepMapping.find(s => s.name === 'conclusion')?.step} : Conclusion`"
        >
          <ConclusionForm />
        </FormStep>

        <!-- Boutons de navigation -->
        <div class="form-navigation">
          <button
            v-if="state.currentStep.value > 1"
            class="btn-secondary"
            @click="prevStep"
          >
            ← Étape précédente
          </button>

          <button
            class="btn-secondary"
            @click="resetForm"
          >
            🔄 Réinitialiser
          </button>

          <button
            v-if="state.currentStep.value < totalSteps"
            class="btn-primary"
            :disabled="!canGoNext"
            @click="nextStep"
          >
            Étape suivante →
          </button>
        </div>
      </div>
    </template>

    <!-- Prévisualisation -->
    <template #preview>
      <Preview :content="report" />
    </template>
  </AppLayout>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.step-indicator {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  background: var(--primary-light);
  border-radius: var(--radius);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cancer-specific-form {
  padding: 1.5rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.form-navigation {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .form-title {
    font-size: 1.25rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-navigation {
    flex-direction: column;
    width: 100%;
  }

  .form-navigation button {
    width: 100%;
  }
}
</style>
