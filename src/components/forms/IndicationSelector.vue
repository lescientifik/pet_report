<script setup>
import { useReportState } from '@/composables/useReportState'
import { INDICATIONS } from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { indication } = useReportState()
</script>

<template>
  <div class="indication-selector">
    <div class="form-section">
      <label class="section-label">Sélectionnez l'indication</label>
      <p class="section-help">
        Choisissez le contexte clinique de cet examen TEP-FDG
      </p>

      <div class="indication-grid">
        <button
          v-for="option in INDICATIONS"
          :key="option.value"
          class="indication-card"
          :class="{ active: indication.value === option.value }"
          @click="indication.value = option.value"
        >
          <div class="indication-icon">{{ option.icon }}</div>
          <div class="indication-label">{{ option.label }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.indication-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.section-help {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.indication-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.indication-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: var(--background);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  color: var(--text-primary);
}

.indication-card:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.indication-card.active {
  border-color: var(--primary-color);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.indication-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.indication-label {
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .indication-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
