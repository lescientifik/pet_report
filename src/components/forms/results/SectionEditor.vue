<script setup>
import { computed } from 'vue'
import { useSectionsState } from '@/composables/useSectionsState'
import { ANATOMICAL_SECTIONS } from '@/utils/constants'
import SectionModeSelector from './SectionModeSelector.vue'
import AnomalieInput from './AnomalieInput.vue'
import LesionCibleForm from './LesionCibleForm.vue'
import LesionsList from './LesionsList.vue'

const { sections, activeSection, setSectionStatus, setSectionText, addLesion, removeLesion, updateLesion } = useSectionsState()

// Obtenir les infos de la section active
const currentSection = computed(() => {
  return ANATOMICAL_SECTIONS.find(s => s.id === activeSection.value)
})

const currentSectionState = computed(() => {
  return sections.value[activeSection.value]
})

// Changer le mode de la section
function handleModeChange(newMode) {
  setSectionStatus(activeSection.value, newMode)
}

// Mettre à jour le texte (mode anomalie)
function handleTextUpdate(newText) {
  setSectionText(activeSection.value, newText)
}

// Ajouter une lésion cible
function handleAddLesion(lesionData) {
  addLesion(activeSection.value, lesionData)
}

// Supprimer une lésion cible
function handleRemoveLesion(lesionId) {
  removeLesion(activeSection.value, lesionId)
}

// Mettre à jour une lésion cible
function handleUpdateLesion(lesionId, updates) {
  updateLesion(activeSection.value, lesionId, updates)
}
</script>

<template>
  <div v-if="currentSection" class="section-editor">
    <!-- Header avec icône et nom de la section -->
    <div class="section-header">
      <span class="section-icon">{{ currentSection.icon }}</span>
      <h3 class="section-title">{{ currentSection.label }}</h3>
    </div>

    <!-- Sélecteur de mode -->
    <SectionModeSelector
      :model-value="currentSectionState.status"
      @update:model-value="handleModeChange"
    />

    <!-- Contenu selon le mode -->
    <div class="section-content">
      <!-- Mode Normal -->
      <div v-if="currentSectionState.status === 'normal'" class="normal-mode">
        <div class="normal-phrase-box">
          <span class="normal-icon">✅</span>
          <p class="normal-phrase">{{ currentSection.normalPhrase }}</p>
        </div>
        <p class="mode-hint">
          Cette phrase sera automatiquement insérée dans le compte rendu.
        </p>
      </div>

      <!-- Mode Anomalie -->
      <div v-else-if="currentSectionState.status === 'anomalie'" class="anomalie-mode">
        <AnomalieInput
          :model-value="currentSectionState.text"
          :suggestions="currentSection.commonAnomalies"
          @update:model-value="handleTextUpdate"
        />
      </div>

      <!-- Mode Lésion cible -->
      <div v-else-if="currentSectionState.status === 'lesion-cible'" class="lesion-mode">
        <!-- Liste des lésions existantes -->
        <LesionsList
          :lesions="currentSectionState.lesions"
          @update-lesion="handleUpdateLesion"
          @remove-lesion="handleRemoveLesion"
        />

        <!-- Formulaire d'ajout -->
        <LesionCibleForm
          :section-id="activeSection"
          @add-lesion="handleAddLesion"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.section-icon {
  font-size: 2rem;
  line-height: 1;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.section-content {
  min-height: 200px;
}

/* Mode Normal */
.normal-mode {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.normal-phrase-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #e8f5e9;
  border: 2px solid #4caf50;
  border-radius: var(--radius);
}

.normal-icon {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.normal-phrase {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
  flex: 1;
}

.mode-hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Mode Anomalie */
.anomalie-mode {
  /* Styles gérés par AnomalieInput */
}

/* Mode Lésion cible */
.lesion-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
