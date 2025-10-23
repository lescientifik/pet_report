import { computed } from 'vue'
import { useReportState } from './useReportState'

// Base de données de ressources par cancer
const RESOURCES_DATABASE = {
  'cancer du sein': {
    title: 'Cancer du Sein',
    icon: '🎗️',
    references: [
      {
        title: 'Classification TNM 8e édition',
        description: 'AJCC Cancer Staging Manual, 8th edition (2017)',
        type: 'guideline'
      },
      {
        title: 'Critères PERCIST',
        description: 'Évaluation de la réponse métabolique au traitement',
        type: 'criteria'
      },
      {
        title: 'Recommandations EANM',
        description: 'Guidelines for FDG PET/CT in oncology (2015)',
        type: 'guideline'
      }
    ],
    tips: [
      'Vérifier l\'envahissement ganglionnaire axillaire',
      'Attention aux métastases ostéocondensantes (faible fixation)',
      'Recherche systématique de métastases hépatiques, pulmonaires et osseuses'
    ]
  },

  'cancer orl': {
    title: 'Cancer ORL',
    icon: '👤',
    references: [
      {
        title: 'Classification TNM 8e édition',
        description: 'Nouvelle classification HPV+ vs HPV-',
        type: 'guideline'
      },
      {
        title: 'Critères de Deauville',
        description: 'Adaptation possible pour évaluation ganglionnaire',
        type: 'criteria'
      },
      {
        title: 'NCCN Guidelines',
        description: 'Head and Neck Cancers (version 2023)',
        type: 'guideline'
      }
    ],
    tips: [
      'Différencier inflammation post-radiothérapie et récidive',
      'Importance de la TEP pour le bilan d\'extension ganglionnaire',
      'Délai de 12 semaines post-radiothérapie recommandé'
    ]
  },

  'lymphome': {
    title: 'Lymphome',
    icon: '🩸',
    references: [
      {
        title: 'Critères de Deauville',
        description: 'Score visuel de 1 à 5 (comparaison médiastin/foie)',
        type: 'criteria'
      },
      {
        title: 'Critères de Lugano',
        description: 'Classification et évaluation de la réponse (2014)',
        type: 'criteria'
      },
      {
        title: 'ESMO Guidelines',
        description: 'Recommandations pour Hodgkin et LBDGC',
        type: 'guideline'
      }
    ],
    tips: [
      'Score Deauville ≤ 3 = réponse complète métabolique',
      'Attention au rebond thymique chez les jeunes patients',
      'Délai de 6-8 semaines post-chimio pour évaluation'
    ]
  },

  'mélanome': {
    title: 'Mélanome',
    icon: '⚫',
    references: [
      {
        title: 'Classification TNM 8e édition',
        description: 'AJCC Melanoma Staging (2017)',
        type: 'guideline'
      },
      {
        title: 'NCCN Guidelines',
        description: 'Melanoma: Cutaneous (version 2023)',
        type: 'guideline'
      },
      {
        title: 'ESMO Guidelines',
        description: 'Melanoma: diagnosis and treatment (2022)',
        type: 'guideline'
      }
    ],
    tips: [
      'Sensibilité élevée pour métastases ganglionnaires',
      'Recherche systématique de métastases cérébrales (IRM complémentaire)',
      'Attention aux faux positifs (activation immunitaire sous immunothérapie)'
    ]
  }
}

export function useCancerResources() {
  const { cancer } = useReportState()

  // Ressources pour le cancer sélectionné
  const currentResources = computed(() => {
    const cancerLower = cancer.value.toLowerCase()
    return RESOURCES_DATABASE[cancerLower] || null
  })

  // Vérifie si le cancer a des ressources disponibles
  const hasResources = computed(() => {
    return currentResources.value !== null
  })

  // Liste de tous les cancers avec ressources
  const availableCancers = computed(() => {
    return Object.keys(RESOURCES_DATABASE)
  })

  return {
    currentResources,
    hasResources,
    availableCancers,
    RESOURCES_DATABASE
  }
}
