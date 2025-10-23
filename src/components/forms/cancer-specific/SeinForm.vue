<script setup>
import { useReportState } from '@/composables/useReportState'
import {
  SEIN_COTE_OPTIONS,
  SEIN_HISTOLOGIE_OPTIONS,
  SEIN_STATUT_OPTIONS
} from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { cancerDetails } = useReportState()
</script>

<template>
  <div class="sein-form">
    <h3 class="form-subtitle">Informations cancer du sein</h3>

    <!-- Côté -->
    <div class="form-section">
      <label class="section-label">Côté <span class="required">*</span></label>
      <ButtonGroup
        v-model="cancerDetails.cote"
        :options="SEIN_COTE_OPTIONS"
      />
    </div>

    <!-- Histologie -->
    <div class="form-section">
      <label class="section-label">Type histologique (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.histologie"
        :options="SEIN_HISTOLOGIE_OPTIONS"
      />
    </div>

    <!-- Statut -->
    <div class="form-section">
      <label class="section-label">Statut (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.statut"
        :options="SEIN_STATUT_OPTIONS"
      />
    </div>

    <!-- Ki67 -->
    <div class="form-section">
      <label for="ki67" class="section-label">Ki67 (optionnel)</label>
      <input
        id="ki67"
        v-model="cancerDetails.ki67"
        type="text"
        class="form-input"
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
