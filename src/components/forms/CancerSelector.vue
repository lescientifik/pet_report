<script setup>
import { ref } from 'vue'
import { useReportState } from '@/composables/useReportState'
import { CANCERS_FREQUENTS } from '@/utils/constants'

const state = useReportState()
const { cancer } = state
const searchQuery = ref('')
const showSearch = ref(false)

// Liste complète de cancers pour la recherche
const allCancers = [
  'cancer du sein',
  'mélanome',
  'cancer ORL',
  'lymphome',
  'cancer du poumon',
  'cancer colorectal',
  'cancer de l\'ovaire',
  'cancer du pancréas',
  'cancer de l\'estomac',
  'cancer de la prostate',
  'cancer du rein',
  'cancer de la vessie',
  'cancer de l\'endomètre',
  'cancer du col utérin',
  'sarcome',
  'cancer du foie',
  'cancer de l\'œsophage',
  'cancer des voies biliaires',
  'cancer de la thyroïde'
]

function selectCancer(value) {
  console.log('=== CANCER SELECTED ===')
  console.log('Cancer choisi:', value)
  console.log('Valeur avant:', cancer.value)

  cancer.value = value
  showSearch.value = false
  searchQuery.value = ''

  console.log('Valeur après:', cancer.value)
  console.log('====================')
}

function handleSearchSelect() {
  if (searchQuery.value.trim()) {
    cancer.value = searchQuery.value.trim()
    showSearch.value = false
    searchQuery.value = ''
  }
}
</script>

<template>
  <div class="cancer-selector">
    <div class="form-section">
      <label class="section-label">Type de cancer</label>
      <p class="section-help">
        Sélectionnez parmi les cancers fréquents ou recherchez un autre type
      </p>

      <!-- Cancers fréquents -->
      <div class="cancer-grid">
        <button
          v-for="option in CANCERS_FREQUENTS"
          :key="option.value"
          class="cancer-card"
          :class="{ active: cancer === option.value }"
          :data-testid="`cancer-${option.value}`"
          @click="selectCancer(option.value)"
        >
          <div class="cancer-icon">{{ option.icon }}</div>
          <div class="cancer-label">{{ option.label }}</div>
        </button>
      </div>

      <!-- Bouton recherche -->
      <div class="search-section">
        <button
          v-if="!showSearch"
          class="btn-secondary search-toggle"
          @click="showSearch = true"
        >
          <span class="search-icon">🔍</span>
          Autre cancer (recherche)
        </button>

        <!-- Zone de recherche -->
        <div v-else class="search-box">
          <div class="search-input-wrapper">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Tapez le nom du cancer..."
              list="cancer-list"
              @keyup.enter="handleSearchSelect"
              @keyup.esc="showSearch = false; searchQuery = ''"
            >
            <datalist id="cancer-list">
              <option v-for="c in allCancers" :key="c" :value="c" />
            </datalist>
          </div>
          <div class="search-actions">
            <button
              class="btn-primary btn-sm"
              :disabled="!searchQuery.trim()"
              @click="handleSearchSelect"
            >
              Valider
            </button>
            <button
              class="btn-secondary btn-sm"
              @click="showSearch = false; searchQuery = ''"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Affichage du cancer sélectionné -->
      <div v-if="cancer" class="selected-cancer">
        <strong>Cancer sélectionné :</strong> {{ cancer }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cancer-selector {
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

.cancer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.cancer-card {
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

.cancer-card:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancer-card.active {
  border-color: var(--primary-color);
  background: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.cancer-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.cancer-label {
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
}

.search-section {
  margin-top: 1rem;
}

.search-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
}

.search-icon {
  font-size: 1.2rem;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.search-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.selected-cancer {
  padding: 0.75rem;
  background: var(--success-light);
  border: 1px solid var(--success-color);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .cancer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
