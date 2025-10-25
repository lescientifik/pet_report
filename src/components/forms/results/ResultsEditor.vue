<script setup>
import { useSectionsState } from '@/composables/useSectionsState'
import SectionTabs from './SectionTabs.vue'
import SectionEditor from './SectionEditor.vue'

const { completedSectionsCount, totalLesions } = useSectionsState()
</script>

<template>
  <div class="results-editor">
    <h3 class="form-subtitle">Résultats par sections anatomiques</h3>

    <p class="section-help">
      Parcourez chaque section anatomique et indiquez si elle est normale ou si vous avez des anomalies à décrire.
      Les phrases types seront automatiquement insérées pour les sections normales.
    </p>

    <!-- Indicateurs de progression -->
    <div class="progress-indicators">
      <div class="indicator">
        <span class="indicator-icon">📊</span>
        <span class="indicator-text">{{ completedSectionsCount }} / 4 sections renseignées</span>
      </div>
      <div v-if="totalLesions > 0" class="indicator">
        <span class="indicator-icon">🎯</span>
        <span class="indicator-text">{{ totalLesions }} lésion(s) cible(s)</span>
      </div>
    </div>

    <!-- Onglets de navigation -->
    <SectionTabs />

    <!-- Éditeur de la section active -->
    <div class="editor-container">
      <SectionEditor />
    </div>
  </div>
</template>

<style scoped>
.results-editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.section-help {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.progress-indicators {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.indicator-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.indicator-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.editor-container {
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .progress-indicators {
    flex-direction: column;
  }

  .indicator {
    width: 100%;
  }
}
</style>
