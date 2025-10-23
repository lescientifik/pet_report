import { ref, reactive, computed } from 'vue'

// Singleton pour partager l'état entre tous les composants
let stateInstance = null

export function useReportState() {
  // Si l'instance existe déjà, la retourner (pattern singleton)
  if (stateInstance) {
    return stateInstance
  }

  // ===== ÉTAT =====
  const indication = ref('')
  const cancer = ref('')
  const cancerDetails = reactive({})

  // Informations patient
  const age = ref('')
  const sexe = ref('')
  const traitement = ref('')
  const dateTraitement = ref('')

  // Comparaisons TEP antérieurs
  const comparaisons = ref([])

  // Résultats et conclusion
  const resultats = ref('')
  const conclusion = ref('')

  // Navigation entre étapes
  const currentStep = ref(1)

  // ===== COMPUTED =====
  const isComplete = computed(() => {
    return !!(indication.value && cancer.value && age.value && sexe.value)
  })

  const hasComparaisons = computed(() => {
    return comparaisons.value.length > 0
  })

  const cancerNeedsForm = computed(() => {
    const cancersWithForms = ['cancer du sein', 'cancer orl', 'lymphome', 'mélanome']
    return cancersWithForms.includes(cancer.value.toLowerCase())
  })

  // ===== ACTIONS =====
  function reset() {
    indication.value = ''
    cancer.value = ''
    Object.keys(cancerDetails).forEach(key => delete cancerDetails[key])
    age.value = ''
    sexe.value = ''
    traitement.value = ''
    dateTraitement.value = ''
    comparaisons.value = []
    resultats.value = ''
    conclusion.value = ''
    currentStep.value = 1
  }

  function addComparaison(comparaison) {
    comparaisons.value.push({
      id: Date.now(),
      ...comparaison
    })
  }

  function removeComparaison(id) {
    comparaisons.value = comparaisons.value.filter(c => c.id !== id)
  }

  function updateComparaison(id, updates) {
    const index = comparaisons.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comparaisons.value[index] = { ...comparaisons.value[index], ...updates }
    }
  }

  function nextStep() {
    if (currentStep.value < 6) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function goToStep(step) {
    if (step >= 1 && step <= 6) {
      currentStep.value = step
    }
  }

  // Créer l'instance singleton
  stateInstance = {
    // État
    indication,
    cancer,
    cancerDetails,
    age,
    sexe,
    traitement,
    dateTraitement,
    comparaisons,
    resultats,
    conclusion,
    currentStep,

    // Computed
    isComplete,
    hasComparaisons,
    cancerNeedsForm,

    // Actions
    reset,
    addComparaison,
    removeComparaison,
    updateComparaison,
    nextStep,
    prevStep,
    goToStep
  }

  return stateInstance
}

// Export pour réinitialiser le singleton (utile pour les tests)
export function resetStateInstance() {
  stateInstance = null
}
