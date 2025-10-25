<script setup>
import { ref } from 'vue'

const props = defineProps({
  lesions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-lesion', 'remove-lesion'])

const editingId = ref(null)
const editForm = ref({
  localisation: '',
  suvmax: '',
  volume: ''
})

function startEdit(lesion) {
  editingId.value = lesion.id
  editForm.value = {
    localisation: lesion.localisation,
    suvmax: lesion.suvmax,
    volume: lesion.volume || ''
  }
}

function saveEdit(lesionId) {
  emit('update-lesion', lesionId, {
    localisation: editForm.value.localisation,
    suvmax: editForm.value.suvmax,
    volume: editForm.value.volume || null
  })
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editForm.value = {
    localisation: '',
    suvmax: '',
    volume: ''
  }
}

function handleRemove(lesionId) {
  if (confirm('Supprimer cette lésion cible ?')) {
    emit('remove-lesion', lesionId)
  }
}
</script>

<template>
  <div class="lesions-list">
    <h4 class="list-title">📊 Lésions cibles enregistrées</h4>

    <div v-if="lesions.length === 0" class="empty-state">
      <p>Aucune lésion cible ajoutée</p>
    </div>

    <div v-else class="lesions-items">
      <div
        v-for="(lesion, index) in lesions"
        :key="lesion.id"
        class="lesion-item"
      >
        <!-- Mode lecture -->
        <div v-if="editingId !== lesion.id" class="lesion-content">
          <div class="lesion-header">
            <span class="lesion-number">Lésion {{ index + 1 }}</span>
            <div class="lesion-actions">
              <button
                class="btn-icon"
                title="Modifier"
                @click="startEdit(lesion)"
              >
                ✏️
              </button>
              <button
                class="btn-icon btn-delete"
                title="Supprimer"
                @click="handleRemove(lesion.id)"
              >
                ✕
              </button>
            </div>
          </div>

          <div class="lesion-details">
            <div class="detail-item">
              <span class="detail-label">Localisation :</span>
              <span class="detail-value">{{ lesion.localisation }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">SUVmax :</span>
              <span class="detail-value">{{ lesion.suvmax }}</span>
            </div>
            <div v-if="lesion.volume" class="detail-item">
              <span class="detail-label">Volume :</span>
              <span class="detail-value">{{ lesion.volume }} ml</span>
            </div>
          </div>
        </div>

        <!-- Mode édition -->
        <div v-else class="lesion-edit">
          <div class="edit-fields">
            <input
              v-model="editForm.localisation"
              type="text"
              class="edit-input"
              placeholder="Localisation"
            >
            <div class="edit-row">
              <input
                v-model="editForm.suvmax"
                type="number"
                step="0.1"
                class="edit-input"
                placeholder="SUVmax"
              >
              <input
                v-model="editForm.volume"
                type="number"
                step="0.1"
                class="edit-input"
                placeholder="Volume (ml)"
              >
            </div>
          </div>
          <div class="edit-actions">
            <button
              class="btn-small btn-primary"
              @click="saveEdit(lesion.id)"
            >
              ✓ Enregistrer
            </button>
            <button
              class="btn-small btn-secondary"
              @click="cancelEdit"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lesions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-state {
  padding: 2rem;
  text-align: center;
  background: var(--background);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.lesions-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lesion-item {
  padding: 1rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: box-shadow 0.2s ease;
}

.lesion-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Mode lecture */
.lesion-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lesion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lesion-number {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 0.95rem;
}

.lesion-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.btn-delete {
  color: var(--error-color);
  font-size: 1.25rem;
}

.lesion-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.detail-value {
  color: var(--text-primary);
}

/* Mode édition */
.lesion-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.edit-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.edit-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.edit-input[type="number"]::-webkit-inner-spin-button,
.edit-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.edit-input[type="number"] {
  -moz-appearance: textfield;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-small.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-small.btn-primary:hover {
  background: #005bb5;
}

.btn-small.btn-secondary {
  background: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-small.btn-secondary:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .edit-row {
    grid-template-columns: 1fr;
  }
}
</style>
