<script setup>
import { useReportState } from '@/composables/useReportState'
import {
  LYMPHOME_TYPE_OPTIONS,
  LYMPHOME_STATUT_OPTIONS
} from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { cancerDetails } = useReportState()
</script>

<template>
  <div class="lymphome-form">
    <h3 class="form-subtitle">Informations lymphome</h3>

    <!-- Type -->
    <div class="form-section">
      <label class="section-label">Type de lymphome <span class="required">*</span></label>
      <ButtonGroup
        v-model="cancerDetails.type"
        :options="LYMPHOME_TYPE_OPTIONS"
        :wrap="true"
      />
    </div>

    <!-- Statut -->
    <div class="form-section">
      <label class="section-label">Statut (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.statut"
        :options="LYMPHOME_STATUT_OPTIONS"
      />
    </div>

    <!-- Stade Ann Arbor -->
    <div class="form-section">
      <label for="stade" class="section-label">Stade Ann Arbor (optionnel)</label>
      <input
        id="stade"
        v-model="cancerDetails.stade"
        type="text"
        class="form-input"
        placeholder="Ex: IV-B"
      >
    </div>

    <!-- Autres informations -->
    <div class="form-section">
      <label for="autres" class="section-label">Autres informations (optionnel)</label>
      <input
        id="autres"
        v-model="cancerDetails.autres"
        type="text"
        class="form-input"
        placeholder="Ex: masse médiastinale..."
      >
    </div>
  </div>
</template>

<style scoped>
.lymphome-form {
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

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.required {
  color: var(--error-color);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}
</style>
