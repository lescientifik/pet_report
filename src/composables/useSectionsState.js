import { ref, computed } from 'vue'
import { ANATOMICAL_SECTIONS } from '@/utils/constants'

// Singleton pour partager l'état entre tous les composants
let sectionsStateInstance = null

export function useSectionsState() {
  // Si l'instance existe déjà, la retourner (pattern singleton)
  if (sectionsStateInstance) {
    return sectionsStateInstance
  }

  // ===== ÉTAT DES SECTIONS =====
  // Initialiser toutes les sections en mode "normal" par défaut
  const sections = ref(
    ANATOMICAL_SECTIONS.reduce((acc, section) => {
      acc[section.id] = {
        status: 'normal', // 'normal' | 'anomalie' | 'lesion-cible'
        text: '',
        lesions: []
      }
      return acc
    }, {})
  )

  // Onglet actif (section courante)
  const activeSection = ref('cervico-encephalique')

  // Options globales
  const autoCalculateDelta = ref(false) // Pour calcul auto des variations SUV

  // ===== COMPUTED =====

  // Obtenir l'état de la section active
  const activeSectionState = computed(() => {
    return sections.value[activeSection.value]
  })

  // Nombre de sections complétées (ayant du contenu)
  const completedSectionsCount = computed(() => {
    return Object.values(sections.value).filter(section => {
      return section.status !== 'normal' || section.text || section.lesions.length > 0
    }).length
  })

  // Total de lésions cibles définies
  const totalLesions = computed(() => {
    return Object.values(sections.value).reduce((total, section) => {
      return total + section.lesions.length
    }, 0)
  })

  // Vérifier si toutes les sections sont en mode "normal"
  const allSectionsNormal = computed(() => {
    return Object.values(sections.value).every(section => section.status === 'normal')
  })

  // ===== ACTIONS =====

  // Changer de section active
  function setActiveSection(sectionId) {
    activeSection.value = sectionId
  }

  // Changer le statut d'une section
  function setSectionStatus(sectionId, status) {
    if (sections.value[sectionId]) {
      sections.value[sectionId].status = status

      // Si on passe en mode "normal", effacer le texte et les lésions
      if (status === 'normal') {
        sections.value[sectionId].text = ''
        sections.value[sectionId].lesions = []
      }
    }
  }

  // Mettre à jour le texte d'une section (mode anomalie)
  function setSectionText(sectionId, text) {
    if (sections.value[sectionId]) {
      sections.value[sectionId].text = text
    }
  }

  // Ajouter une lésion cible
  function addLesion(sectionId, lesion) {
    if (sections.value[sectionId]) {
      sections.value[sectionId].lesions.push({
        id: Date.now(),
        ...lesion
      })
    }
  }

  // Supprimer une lésion cible
  function removeLesion(sectionId, lesionId) {
    if (sections.value[sectionId]) {
      sections.value[sectionId].lesions = sections.value[sectionId].lesions.filter(
        l => l.id !== lesionId
      )
    }
  }

  // Mettre à jour une lésion cible
  function updateLesion(sectionId, lesionId, updates) {
    if (sections.value[sectionId]) {
      const index = sections.value[sectionId].lesions.findIndex(l => l.id === lesionId)
      if (index !== -1) {
        sections.value[sectionId].lesions[index] = {
          ...sections.value[sectionId].lesions[index],
          ...updates
        }
      }
    }
  }

  // Réinitialiser toutes les sections
  function resetSections() {
    ANATOMICAL_SECTIONS.forEach(section => {
      sections.value[section.id] = {
        status: 'normal',
        text: '',
        lesions: []
      }
    })
    activeSection.value = 'cervico-encephalique'
  }

  // Basculer l'option de calcul auto des deltas
  function toggleAutoCalculateDelta() {
    autoCalculateDelta.value = !autoCalculateDelta.value
  }

  // Créer l'instance singleton
  sectionsStateInstance = {
    // État
    sections,
    activeSection,
    autoCalculateDelta,

    // Computed
    activeSectionState,
    completedSectionsCount,
    totalLesions,
    allSectionsNormal,

    // Actions
    setActiveSection,
    setSectionStatus,
    setSectionText,
    addLesion,
    removeLesion,
    updateLesion,
    resetSections,
    toggleAutoCalculateDelta
  }

  return sectionsStateInstance
}

// Export pour réinitialiser le singleton (utile pour les tests)
export function resetSectionsStateInstance() {
  sectionsStateInstance = null
}
