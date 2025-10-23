<script setup>
import { useReportState } from '@/composables/useReportState'
import { MELANOME_SITE_OPTIONS } from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { cancerDetails } = useReportState()
</script>

<template>
  <div class="melanome-form">
    <h3 class="form-subtitle">Informations mélanome</h3>

    <!-- Site primitif -->
    <div class="form-section">
      <label class="section-label">Site primitif <span class="required">*</span></label>
      <ButtonGroup
        v-model="cancerDetails.site"
        :options="MELANOME_SITE_OPTIONS"
        :wrap="true"
      />
    </div>

    <!-- Breslow -->
    <div class="form-section">
      <label for="breslow" class="section-label">Indice de Breslow (optionnel)</label>
      <input
        id="breslow"
        v-model="cancerDetails.breslow"
        type="text"
        class="form-input"
        placeholder="Ex: 2.5 mm"
      >
    </div>

    <!-- Mutation -->
    <div class="form-section">
      <label for="mutation" class="section-label">Statut mutationnel (optionnel)</label>
      <input
        id="mutation"
        v-model="cancerDetails.mutation"
        type="text"
        class="form-input"
        placeholder="Ex: BRAF V600E, NRAS..."
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
        placeholder="Ex: ulcération, métastases connues..."
      >
    </div>
  </div>
</template>

<style scoped>
.melanome-form {
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
