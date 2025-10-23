<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/ui/AppLayout.vue'
import FormStep from '@/components/ui/FormStep.vue'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'
import Preview from '@/components/ui/Preview.vue'

// État temporaire pour la démo
const currentStep = ref(1)
const selectedIndication = ref('')
const selectedCancer = ref('')
const previewContent = ref('')

// Options de démo
const indicationOptions = [
  { value: 'bilan', label: 'Bilan initial' },
  { value: 'reevaluation', label: 'Réévaluation' },
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'recidive', label: 'Recherche de récidive' }
]

const cancerOptions = [
  { value: 'sein', label: 'Sein' },
  { value: 'melanome', label: 'Mélanome' },
  { value: 'orl', label: 'ORL' },
  { value: 'lymphome', label: 'Lymphome' }
]

// Générer un aperçu simple pour tester
function updatePreview() {
  let text = ''

  if (selectedIndication.value) {
    const indication = indicationOptions.find(opt => opt.value === selectedIndication.value)
    text += `INDICATION\n${indication.label}\n\n`
  }

  if (selectedCancer.value) {
    const cancer = cancerOptions.find(opt => opt.value === selectedCancer.value)
    text += `CANCER\n${cancer.label}\n\n`
  }

  if (!text) {
    text = ''
  }

  previewContent.value = text
}

// Mettre à jour la prévisualisation quand les valeurs changent
function handleIndicationChange(value) {
  selectedIndication.value = value
  updatePreview()
}

function handleCancerChange(value) {
  selectedCancer.value = value
  updatePreview()
}
</script>

<template>
  <AppLayout>
    <!-- Formulaires -->
    <template #form>
      <div class="form-container">
        <FormStep
          :active="currentStep === 1"
          title="Étape 1 : Indication"
        >
          <div class="form-section">
            <label class="section-label">Sélectionnez l'indication</label>
            <ButtonGroup
              :model-value="selectedIndication"
              :options="indicationOptions"
              :wrap="true"
              @update:model-value="handleIndicationChange"
            />
          </div>

          <div style="margin-top: 2rem; padding: 1rem; background: var(--background); border-radius: var(--radius);">
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">
              <strong>Phase 2 : Composants de base - Terminée !</strong>
            </p>
            <ul style="list-style: none; padding: 0; font-size: 0.875rem;">
              <li style="padding: 0.25rem 0; color: var(--success-color);">✓ ButtonGroup.vue créé</li>
              <li style="padding: 0.25rem 0; color: var(--success-color);">✓ FormStep.vue créé</li>
              <li style="padding: 0.25rem 0; color: var(--success-color);">✓ Preview.vue créé</li>
              <li style="padding: 0.25rem 0; color: var(--success-color);">✓ AppLayout.vue créé</li>
            </ul>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 1rem;">
              Prochaine étape : Phase 3 - Composables (logique métier)
            </p>
          </div>
        </FormStep>

        <FormStep
          :active="currentStep === 2"
          title="Étape 2 : Type de cancer"
        >
          <div class="form-section">
            <label class="section-label">Sélectionnez le type de cancer</label>
            <ButtonGroup
              :model-value="selectedCancer"
              :options="cancerOptions"
              :wrap="true"
              @update:model-value="handleCancerChange"
            />
          </div>
        </FormStep>
      </div>

      <!-- Boutons de navigation temporaires -->
      <div class="form-container">
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button
            v-if="currentStep > 1"
            class="btn-secondary"
            @click="currentStep--"
          >
            Étape précédente
          </button>
          <button
            v-if="currentStep < 2"
            class="btn-primary"
            @click="currentStep++"
          >
            Étape suivante
          </button>
        </div>
      </div>
    </template>

    <!-- Prévisualisation -->
    <template #preview>
      <Preview :content="previewContent" />
    </template>
  </AppLayout>
</template>

<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}
</style>
