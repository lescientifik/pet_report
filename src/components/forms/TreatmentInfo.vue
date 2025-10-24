<script setup>
import { ref, computed } from 'vue'
import { useReportState } from '@/composables/useReportState'
import { TRAITEMENT_TYPES } from '@/utils/constants'
import ButtonGroup from '@/components/ui/ButtonGroup.vue'

const { traitements, addTraitement, removeTraitement } = useReportState()

// État du formulaire d'ajout
const showAddForm = ref(false)
const newTraitement = ref({
  type: '',
  nom: '',
  dateDebut: '',
  dateFin: ''
})

// Déterminer les champs à afficher selon le type
const showNom = computed(() => {
  return newTraitement.value.type === 'systemique' || newTraitement.value.type === 'radiotherapie' || newTraitement.value.type === 'chirurgie'
})

const showDateDebut = computed(() => {
  return newTraitement.value.type === 'systemique' || newTraitement.value.type === 'radiotherapie' || newTraitement.value.type === 'chirurgie'
})

const showDateFin = computed(() => {
  return newTraitement.value.type === 'radiotherapie'
})

// Labels dynamiques
const nomLabel = computed(() => {
  if (newTraitement.value.type === 'systemique') return 'Type de traitement'
  if (newTraitement.value.type === 'chirurgie') return 'Type de chirurgie'
  if (newTraitement.value.type === 'radiotherapie') return 'Localisation'
  return 'Nom'
})

const nomPlaceholder = computed(() => {
  if (newTraitement.value.type === 'systemique') return 'Ex: chimiothérapie, immunothérapie...'
  if (newTraitement.value.type === 'chirurgie') return 'Ex: mastectomie, lobectomie...'
  if (newTraitement.value.type === 'radiotherapie') return 'Ex: cérébrale, thoracique...'
  return ''
})

const dateDebutLabel = computed(() => {
  if (newTraitement.value.type === 'chirurgie') return 'Date de la chirurgie'
  if (newTraitement.value.type === 'radiotherapie') return 'Date de début'
  return 'Date de début'
})

function handleAddTraitement() {
  if (!newTraitement.value.type) return

  // Validation selon le type
  if (newTraitement.value.type === 'systemique') {
    if (!newTraitement.value.nom || !newTraitement.value.dateDebut) return
  } else if (newTraitement.value.type === 'chirurgie') {
    if (!newTraitement.value.nom || !newTraitement.value.dateDebut) return
  } else if (newTraitement.value.type === 'radiotherapie') {
    if (!newTraitement.value.nom) return
  }

  addTraitement({
    ...newTraitement.value
  })

  // Réinitialiser le formulaire
  newTraitement.value = {
    type: '',
    nom: '',
    dateDebut: '',
    dateFin: ''
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
  const found = TRAITEMENT_TYPES.find(t => t.value === type)
  return found ? found.label : type
}

function getTraitementDisplay(traitement) {
  const typeLabel = getTypeLabel(traitement.type)
  const parts = [typeLabel]

  if (traitement.nom) {
    parts.push(traitement.nom)
  }

  if (traitement.type === 'systemique' && traitement.dateDebut) {
    parts.push(`(début: ${formatDate(traitement.dateDebut)})`)
  } else if (traitement.type === 'chirurgie' && traitement.dateDebut) {
    parts.push(`(${formatDate(traitement.dateDebut)})`)
  } else if (traitement.type === 'radiotherapie') {
    const dates = []
    if (traitement.dateDebut) dates.push(`début: ${formatDate(traitement.dateDebut)}`)
    if (traitement.dateFin) dates.push(`fin: ${formatDate(traitement.dateFin)}`)
    if (dates.length > 0) parts.push(`(${dates.join(', ')})`)
  }

  return parts.join(' - ')
}

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  if (!newTraitement.value.type) return false

  if (newTraitement.value.type === 'systemique') {
    return !!(newTraitement.value.nom && newTraitement.value.dateDebut)
  } else if (newTraitement.value.type === 'chirurgie') {
    return !!(newTraitement.value.nom && newTraitement.value.dateDebut)
  } else if (newTraitement.value.type === 'radiotherapie') {
    return !!newTraitement.value.nom
  }

  return false
})
</script>

<template>
  <div class="treatment-info">
    <h3 class="form-subtitle">Traitements</h3>

    <p class="section-help">
      Ajoutez tous les traitements reçus avant ce TEP (systémique, chirurgie, radiothérapie)
    </p>

    <!-- Liste des traitements -->
    <div v-if="traitements.length > 0" class="traitements-list">
      <div
        v-for="traitement in traitements"
        :key="traitement.id"
        class="traitement-item"
      >
        <div class="traitement-content">
          <span class="traitement-text">{{ getTraitementDisplay(traitement) }}</span>
          <button
            class="btn-delete"
            @click="removeTraitement(traitement.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Message si pas de traitement -->
    <div v-else class="no-traitements">
      <p>Aucun traitement ajouté</p>
    </div>

    <!-- Formulaire d'ajout -->
    <div v-if="!showAddForm" class="add-button-container">
      <button
        class="btn-secondary"
        @click="showAddForm = true"
      >
        + Ajouter un traitement
      </button>
    </div>

    <div v-else class="add-form">
      <!-- Type de traitement -->
      <div class="form-section">
        <label class="section-label">Type de traitement <span class="required">*</span></label>
        <ButtonGroup
          v-model="newTraitement.type"
          :options="TRAITEMENT_TYPES"
        />
      </div>

      <!-- Champs conditionnels selon le type -->
      <template v-if="newTraitement.type">
        <!-- Nom/Type/Localisation (systémique et radiothérapie) -->
        <div v-if="showNom" class="form-section">
          <label for="traitement-nom" class="section-label">
            {{ nomLabel }} <span class="required">*</span>
          </label>
          <input
            id="traitement-nom"
            v-model="newTraitement.nom"
            type="text"
            class="form-input"
            :placeholder="nomPlaceholder"
          >
        </div>

        <!-- Date de début -->
        <div v-if="showDateDebut" class="form-section">
          <label for="traitement-date-debut" class="section-label">
            {{ dateDebutLabel }}
            <span v-if="newTraitement.type !== 'radiotherapie'" class="required">*</span>
          </label>
          <input
            id="traitement-date-debut"
            v-model="newTraitement.dateDebut"
            type="date"
            class="form-input"
          >
        </div>

        <!-- Date de fin (radiothérapie uniquement) -->
        <div v-if="showDateFin" class="form-section">
          <label for="traitement-date-fin" class="section-label">Date de fin</label>
          <input
            id="traitement-date-fin"
            v-model="newTraitement.dateFin"
            type="date"
            class="form-input"
          >
        </div>
      </template>

      <div class="form-actions">
        <button
          class="btn-primary"
          :disabled="!isFormValid"
          @click="handleAddTraitement"
        >
          Ajouter
        </button>
        <button
          class="btn-secondary"
          @click="showAddForm = false; newTraitement = { type: '', nom: '', dateDebut: '', dateFin: '' }"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.treatment-info {
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

.traitements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.traitement-item {
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.traitement-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.traitement-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.btn-delete {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.btn-delete:hover {
  color: #c41e3a;
}

.no-traitements {
  padding: 2rem;
  text-align: center;
  background: var(--background);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.no-traitements p {
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
