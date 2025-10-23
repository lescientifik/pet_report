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
import IndicationSelector from '@/components/forms/IndicationSelector.vue'
import CancerSelector from '@/components/forms/CancerSelector.vue'
import PatientInfo from '@/components/forms/PatientInfo.vue'
import TepComparison from '@/components/forms/TepComparison.vue'
import ResultsForm from '@/components/forms/ResultsForm.vue'
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

// Charger les données sauvegardées au démarrage
onMounted(() => {
  storage.load()
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

// Validation pour navigation
const canGoToStep3 = computed(() => {
  return state.indication.value && state.cancer.value
})

const canGoToStep4 = computed(() => {
  return canGoToStep3.value && state.age.value && state.sexe.value
})

// Navigation
function nextStep() {
  if (state.currentStep.value === 2 && !canGoToStep3.value) return
  if (state.currentStep.value === 3 && !canGoToStep4.value) return
  state.nextStep()
}

function prevStep() {
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
            Étape {{ state.currentStep }} / 6
          </div>
        </div>

        <!-- Étape 1 : Indication -->
        <FormStep
          :active="state.currentStep === 1"
          title="Étape 1 : Indication"
        >
          <IndicationSelector />
        </FormStep>

        <!-- Étape 2 : Type de cancer + formulaire spécifique -->
        <FormStep
          :active="state.currentStep === 2"
          title="Étape 2 : Type de cancer"
        >
          <div class="step-content">
            <CancerSelector />

            <!-- Formulaire spécifique au cancer -->
            <div v-if="cancerFormComponent" class="cancer-specific-form">
              <component :is="cancerFormComponent" />
            </div>
          </div>
        </FormStep>

        <!-- Étape 3 : Informations patient -->
        <FormStep
          :active="state.currentStep === 3"
          title="Étape 3 : Informations patient"
        >
          <PatientInfo />
        </FormStep>

        <!-- Étape 4 : Comparaisons TEP -->
        <FormStep
          :active="state.currentStep === 4"
          title="Étape 4 : Comparaisons TEP antérieurs (optionnel)"
        >
          <TepComparison />
        </FormStep>

        <!-- Étape 5 : Résultats -->
        <FormStep
          :active="state.currentStep === 5"
          title="Étape 5 : Résultats"
        >
          <ResultsForm />
        </FormStep>

        <!-- Étape 6 : Conclusion -->
        <FormStep
          :active="state.currentStep === 6"
          title="Étape 6 : Conclusion"
        >
          <ConclusionForm />
        </FormStep>

        <!-- Boutons de navigation -->
        <div class="form-navigation">
          <button
            v-if="state.currentStep > 1"
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
            v-if="state.currentStep < 6"
            class="btn-primary"
            :disabled="state.currentStep === 2 && !canGoToStep3"
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
