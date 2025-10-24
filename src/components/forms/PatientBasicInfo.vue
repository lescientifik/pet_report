<script setup>
import { useReportState } from '@/composables/useReportState'
import { SEXE_OPTIONS } from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { age, sexe } = useReportState()
</script>

<template>
  <div class="patient-basic-info">
    <h3 class="form-subtitle">Informations patient</h3>

    <!-- Âge -->
    <div class="form-section">
      <label for="age" class="section-label">Âge <span class="required">*</span></label>
      <input
        id="age"
        v-model.number="age"
        type="number"
        class="form-input"
        placeholder="Ex: 58"
        min="0"
        max="120"
      >
    </div>

    <!-- Sexe -->
    <div class="form-section">
      <label class="section-label">Sexe <span class="required">*</span></label>
      <ButtonGroup
        v-model="sexe"
        :options="SEXE_OPTIONS"
      />
    </div>
  </div>
</template>

<style scoped>
.patient-basic-info {
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

/* Champs number sans flèches */
.form-input[type="number"]::-webkit-outer-spin-button,
.form-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-input[type="number"] {
  -moz-appearance: textfield;
}
</style>
