import { watch, toRaw } from 'vue'
import { useReportState } from './useReportState'
import { useSectionsState } from './useSectionsState'

const STORAGE_KEY = 'petReportState'
const EXPIRY_HOURS = 24

export function useLocalStorage() {
  const state = useReportState()
  const sectionsState = useSectionsState()

  // Sauvegarde automatique de l'état
  function save() {
    try {
      const stateToSave = {
        indication: state.indication.value,
        cancer: state.cancer.value,
        cancerDetails: toRaw(state.cancerDetails),
        age: state.age.value,
        sexe: state.sexe.value,
        traitements: toRaw(state.traitements.value),
        comparaisons: toRaw(state.comparaisons.value),
        resultats: state.resultats.value,
        conclusion: state.conclusion.value,
        currentStep: state.currentStep.value,
        sections: toRaw(sectionsState.sections.value),
        activeSection: sectionsState.activeSection.value
      }

      const data = {
        state: stateToSave,
        timestamp: Date.now(),
        version: '1.1.0' // Incrémenté pour sections
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (e) {
      console.error('Erreur lors de la sauvegarde:', e)
      return false
    }
  }

  // Chargement de l'état sauvegardé
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        return { success: false, reason: 'no_data' }
      }

      const data = JSON.parse(saved)

      // Vérifier l'expiration
      const now = Date.now()
      const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000
      const age = now - data.timestamp

      if (age > expiryMs) {
        clear()
        return { success: false, reason: 'expired', age: Math.floor(age / 1000 / 60 / 60) }
      }

      // Restaurer l'état
      const savedState = data.state
      state.indication.value = savedState.indication || ''
      state.cancer.value = savedState.cancer || ''

      // Restaurer cancerDetails (objet réactif)
      Object.keys(state.cancerDetails).forEach(key => delete state.cancerDetails[key])
      if (savedState.cancerDetails) {
        Object.assign(state.cancerDetails, savedState.cancerDetails)
      }

      state.age.value = savedState.age || ''
      state.sexe.value = savedState.sexe || ''
      state.traitements.value = savedState.traitements || []
      state.comparaisons.value = savedState.comparaisons || []
      state.resultats.value = savedState.resultats || ''
      state.conclusion.value = savedState.conclusion || ''
      state.currentStep.value = savedState.currentStep || 1

      // Restaurer sections si présentes (v1.1.0+)
      if (savedState.sections) {
        Object.assign(sectionsState.sections.value, savedState.sections)
      }
      if (savedState.activeSection) {
        sectionsState.activeSection.value = savedState.activeSection
      }

      return {
        success: true,
        age: Math.floor(age / 1000 / 60),
        version: data.version
      }
    } catch (e) {
      console.error('Erreur lors du chargement:', e)
      return { success: false, reason: 'error', error: e.message }
    }
  }

  // Effacer le stockage
  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (e) {
      console.error('Erreur lors de l\'effacement:', e)
      return false
    }
  }

  // Activer la sauvegarde automatique
  function enableAutoSave() {
    // Observer tous les changements d'état
    const watchers = [
      watch(() => state.indication.value, save),
      watch(() => state.cancer.value, save),
      watch(() => state.cancerDetails, save, { deep: true }),
      watch(() => state.age.value, save),
      watch(() => state.sexe.value, save),
      watch(() => state.traitements.value, save, { deep: true }),
      watch(() => state.comparaisons.value, save, { deep: true }),
      watch(() => state.resultats.value, save),
      watch(() => state.conclusion.value, save),
      watch(() => state.currentStep.value, save),
      watch(() => sectionsState.sections.value, save, { deep: true }),
      watch(() => sectionsState.activeSection.value, save)
    ]

    // Retourner une fonction pour arrêter tous les watchers
    return () => {
      watchers.forEach(unwatch => unwatch())
    }
  }

  // Obtenir des infos sur le stockage actuel
  function getStorageInfo() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        return { exists: false }
      }

      const data = JSON.parse(saved)
      const age = Date.now() - data.timestamp
      const ageMinutes = Math.floor(age / 1000 / 60)
      const ageHours = Math.floor(ageMinutes / 60)

      return {
        exists: true,
        timestamp: data.timestamp,
        ageMinutes,
        ageHours,
        version: data.version,
        isExpired: age > (EXPIRY_HOURS * 60 * 60 * 1000)
      }
    } catch (e) {
      return { exists: false, error: e.message }
    }
  }

  return {
    save,
    load,
    clear,
    enableAutoSave,
    getStorageInfo,
    EXPIRY_HOURS
  }
}
