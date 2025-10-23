<script setup>
import { ref } from 'vue'
import { useReportState } from '@/composables/useReportState'
import { TEP_TYPES } from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { comparaisons, addComparaison, removeComparaison } = useReportState()

// État du formulaire d'ajout
const showAddForm = ref(false)
const newComparaison = ref({
  type: '',
  date: '',
  commentaire: ''
})

function handleAddComparaison() {
  if (!newComparaison.value.type || !newComparaison.value.date) {
    return
  }

  addComparaison({
    ...newComparaison.value
  })

  // Réinitialiser le formulaire
  newComparaison.value = {
    type: '',
    date: '',
    commentaire: ''
  }
  showAddForm.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getTypeLabel(type) {
  const found = TEP_TYPES.find(t => t.value === type)
  return found ? found.label : type
}
</script>

<template>
  <div class="tep-comparison">
    <h3 class="form-subtitle">Comparaisons TEP antérieurs</h3>

    <p class="section-help">
      Ajoutez les TEP antérieurs à mentionner dans le compte rendu (baseline, nadir, contrôle)
    </p>

    <!-- Liste des comparaisons -->
    <div v-if="comparaisons.length > 0" class="comparaisons-list">
      <div
        v-for="comp in comparaisons"
        :key="comp.id"
        class="comparaison-item"
      >
        <div class="comparaison-header">
          <span class="comparaison-type">{{ getTypeLabel(comp.type) }}</span>
          <span class="comparaison-date">{{ formatDate(comp.date) }}</span>
          <button
            class="btn-delete"
            @click="removeComparaison(comp.id)"
          >
            ✕
          </button>
        </div>
        <div v-if="comp.commentaire" class="comparaison-comment">
          {{ comp.commentaire }}
        </div>
      </div>
    </div>

    <!-- Message si pas de comparaison -->
    <div v-else class="no-comparaisons">
      <p>Aucun TEP de comparaison ajouté</p>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="!showAddForm" class="add-button-container">
      <button
        class="btn-secondary"
        @click="showAddForm = true"
      >
        + Ajouter un TEP de comparaison
      </button>
    </div>

    <div v-else class="add-form">
      <div class="form-section">
        <label class="section-label">Type de TEP <span class="required">*</span></label>
        <ButtonGroup
          v-model="newComparaison.type"
          :options="TEP_TYPES"
        />
      </div>

      <div class="form-section">
        <label for="tep-date" class="section-label">Date <span class="required">*</span></label>
        <input
          id="tep-date"
          v-model="newComparaison.date"
          type="date"
          class="form-input"
        >
      </div>

      <div class="form-section">
        <label for="tep-comment" class="section-label">Commentaire (optionnel)</label>
        <input
          id="tep-comment"
          v-model="newComparaison.commentaire"
          type="text"
          class="form-input"
          placeholder="Ex: aspect stable, régression complète..."
        >
      </div>

      <div class="form-actions">
        <button
          class="btn-primary"
          :disabled="!newComparaison.type || !newComparaison.date"
          @click="handleAddComparaison"
        >
          Ajouter
        </button>
        <button
          class="btn-secondary"
          @click="showAddForm = false; newComparaison = { type: '', date: '', commentaire: '' }"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tep-comparison {
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
}

.comparaisons-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comparaison-item {
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.comparaison-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comparaison-type {
  font-weight: 600;
  color: var(--primary-color);
}

.comparaison-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.btn-delete {
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.btn-delete:hover {
  color: #c41e3a;
}

.comparaison-comment {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}

.no-comparaisons {
  padding: 2rem;
  text-align: center;
  background: var(--background);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.no-comparaisons p {
  margin: 0;
}

.add-button-container {
  display: flex;
  justify-content: center;
}

.add-form {
  padding: 1.5rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
</style>
