<script setup>
import { computed } from 'vue'
import { useReportState } from '@/composables/useReportState'
import {
  ORL_TOPOGRAPHIE_OPTIONS,
  ORL_SOUS_LOCALISATION,
  ORL_HPV_OPTIONS
} from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { cancerDetails } = useReportState()

// Sous-localisations dynamiques selon la topographie
const sousLocalisationOptions = computed(() => {
  const topo = cancerDetails.topographie
  if (!topo || !ORL_SOUS_LOCALISATION[topo]) {
    return []
  }
  return ORL_SOUS_LOCALISATION[topo].map(loc => ({
    value: loc,
    label: loc.charAt(0).toUpperCase() + loc.slice(1)
  }))
})
</script>

<template>
  <div class="orl-form">
    <h3 class="form-subtitle">Informations cancer ORL</h3>

    <!-- Topographie -->
    <div class="form-section">
      <label class="section-label">Topographie <span class="required">*</span></label>
      <ButtonGroup
        v-model="cancerDetails.topographie"
        :options="ORL_TOPOGRAPHIE_OPTIONS"
        :wrap="true"
      />
    </div>

    <!-- Sous-localisation -->
    <div v-if="sousLocalisationOptions.length > 0" class="form-section">
      <label class="section-label">Sous-localisation (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.sousLocalisation"
        :options="sousLocalisationOptions"
        :wrap="true"
      />
    </div>

    <!-- Statut HPV (surtout pour oropharynx) -->
    <div class="form-section">
      <label class="section-label">Statut HPV (optionnel)</label>
      <ButtonGroup
        v-model="cancerDetails.hpv"
        :options="ORL_HPV_OPTIONS"
      />
    </div>

    <!-- Histologie -->
    <div class="form-section">
      <label for="histologie" class="section-label">Histologie (optionnel)</label>
      <input
        id="histologie"
        v-model="cancerDetails.histologie"
        type="text"
        class="form-input"
        placeholder="Ex: carcinome épidermoïde"
      >
    </div>
  </div>
</template>

<style scoped>
.orl-form {
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
