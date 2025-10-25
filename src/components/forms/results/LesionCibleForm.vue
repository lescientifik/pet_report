<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sectionId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['add-lesion'])

// État du formulaire
const newLesion = ref({
  localisation: '',
  suvmax: '',
  volume: ''
})

// Validation
const isValid = computed(() => {
  return newLesion.value.localisation && newLesion.value.suvmax
})

function handleAdd() {
  if (!isValid.value) return

  emit('add-lesion', {
    localisation: newLesion.value.localisation,
    suvmax: newLesion.value.suvmax,
    volume: newLesion.value.volume || null
  })

  // Réinitialiser le formulaire
  newLesion.value = {
    localisation: '',
    suvmax: '',
    volume: ''
  }
}

function handleCancel() {
  newLesion.value = {
    localisation: '',
    suvmax: '',
    volume: ''
  }
}
</script>

<template>
  <div class="lesion-form">
    <h4 class="form-title">Ajouter une lésion cible</h4>

    <div class="form-fields">
      <div class="form-group">
        <label for="lesion-localisation" class="field-label">
          Localisation <span class="required">*</span>
        </label>
        <input
          id="lesion-localisation"
          v-model="newLesion.localisation"
          type="text"
          class="form-input"
          placeholder="Ex: segment VII hépatique, vertèbre L3..."
          data-testid="lesion-localisation"
        >
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="lesion-suvmax" class="field-label">
            SUVmax <span class="required">*</span>
          </label>
          <input
            id="lesion-suvmax"
            v-model="newLesion.suvmax"
            type="number"
            step="0.1"
            class="form-input"
            placeholder="Ex: 8.5"
            data-testid="lesion-suvmax"
          >
        </div>

        <div class="form-group">
          <label for="lesion-volume" class="field-label">
            Volume (ml)
          </label>
          <input
            id="lesion-volume"
            v-model="newLesion.volume"
            type="number"
            step="0.1"
            class="form-input"
            placeholder="Ex: 12.3"
            data-testid="lesion-volume"
          >
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
        class="btn-primary"
        :disabled="!isValid"
        @click="handleAdd"
      >
        ✓ Ajouter
      </button>
      <button
        class="btn-secondary"
        @click="handleCancel"
      >
        Annuler
      </button>
    </div>
  </div>
</template>

<style scoped>
.lesion-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius);
}

.form-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-label {
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

/* Supprimer les spinners pour les inputs number */
.form-input[type="number"]::-webkit-inner-spin-button,
.form-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-input[type="number"] {
  -moz-appearance: textfield;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
