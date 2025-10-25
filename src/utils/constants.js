// ===== INDICATIONS =====
export const INDICATIONS = [
  { value: 'bilan', label: 'Bilan initial', icon: '🔍' },
  { value: 'reevaluation', label: 'Réévaluation', icon: '📈' },
  { value: 'surveillance', label: 'Surveillance', icon: '👁️' },
  { value: 'recidive', label: 'Recherche de récidive', icon: '🔎' }
]

// ===== CANCERS FRÉQUENTS =====
export const CANCERS_FREQUENTS = [
  { value: 'cancer du sein', label: 'Sein', icon: '🎗️' },
  { value: 'mélanome', label: 'Mélanome', icon: '⚫' },
  { value: 'cancer ORL', label: 'ORL', icon: '👤' },
  { value: 'lymphome', label: 'Lymphome', icon: '🩸' }
]

// ===== MAPPING CANCER → FORMULAIRE =====
export const CANCER_FORM_MAP = {
  'cancer du sein': 'SeinForm',
  'mélanome': 'MelanomeForm',
  'cancer ORL': 'OrlForm',
  'cancer orl': 'OrlForm',
  'lymphome': 'LymphomeForm'
}

// ===== TYPES DE TEP ANTÉRIEURS =====
export const TEP_TYPES = [
  { value: 'baseline', label: 'Baseline' },
  { value: 'nadir', label: 'Nadir' },
  { value: 'controle', label: 'Contrôle' }
]

// ===== OPTIONS SEIN =====
export const SEIN_COTE_OPTIONS = [
  { value: 'gauche', label: 'Gauche' },
  { value: 'droit', label: 'Droit' },
  { value: 'bilatéral', label: 'Bilatéral' }
]

export const SEIN_HISTOLOGIE_OPTIONS = [
  { value: 'canalaire', label: 'Canalaire' },
  { value: 'lobulaire', label: 'Lobulaire' },
  { value: 'autre', label: 'Autre' }
]

export const SEIN_STATUT_OPTIONS = [
  { value: 'RH+', label: 'RH+' },
  { value: 'HER2+', label: 'HER2+' },
  { value: 'triple négatif', label: 'Triple négatif' }
]

// ===== OPTIONS ORL =====
export const ORL_TOPOGRAPHIE_OPTIONS = [
  { value: 'cavité orale', label: 'Cavité orale' },
  { value: 'oropharynx', label: 'Oropharynx' },
  { value: 'nasopharynx', label: 'Nasopharynx' },
  { value: 'hypopharynx', label: 'Hypopharynx' },
  { value: 'larynx', label: 'Larynx' },
  { value: 'sinus', label: 'Sinus' }
]

export const ORL_SOUS_LOCALISATION = {
  'cavité orale': ['langue mobile', 'plancher buccal', 'gencive', 'palais', 'joue'],
  'oropharynx': ['base de langue', 'amygdale', 'paroi pharyngée', 'palais mou'],
  'nasopharynx': ['paroi postérieure', 'paroi latérale', 'voûte'],
  'hypopharynx': ['sinus piriforme', 'paroi postérieure', 'région rétro-cricoïdienne'],
  'larynx': ['sus-glottique', 'glottique', 'sous-glottique'],
  'sinus': ['maxillaire', 'ethmoïdal', 'frontal', 'sphénoïdal']
}

export const ORL_HPV_OPTIONS = [
  { value: 'positif', label: 'HPV+' },
  { value: 'négatif', label: 'HPV-' },
  { value: 'inconnu', label: 'Inconnu' }
]

// ===== OPTIONS LYMPHOME =====
export const LYMPHOME_TYPE_OPTIONS = [
  { value: 'Hodgkin classique', label: 'Hodgkin classique' },
  { value: 'LBDGC', label: 'LBDGC' },
  { value: 'lymphome folliculaire', label: 'Folliculaire' },
  { value: 'lymphome du manteau', label: 'Du manteau' },
  { value: 'lymphome de la zone marginale', label: 'Zone marginale' },
  { value: 'lymphome T périphérique', label: 'T périphérique' },
  { value: 'autre', label: 'Autre' }
]

export const LYMPHOME_STATUT_OPTIONS = [
  { value: 'nouvellement diagnostiqué', label: 'Nouvellement diagnostiqué' },
  { value: 'rechute', label: 'Rechute' },
  { value: 'réfractaire', label: 'Réfractaire' }
]

// ===== OPTIONS MÉLANOME =====
export const MELANOME_SITE_OPTIONS = [
  { value: 'tête et cou', label: 'Tête et cou' },
  { value: 'tronc', label: 'Tronc' },
  { value: 'membre supérieur', label: 'Membre supérieur' },
  { value: 'membre inférieur', label: 'Membre inférieur' },
  { value: 'acraux', label: 'Acraux' },
  { value: 'muqueux', label: 'Muqueux' },
  { value: 'inconnu', label: 'Inconnu' }
]

// ===== SEXE OPTIONS =====
export const SEXE_OPTIONS = [
  { value: 'M', label: 'Homme' },
  { value: 'F', label: 'Femme' }
]

// ===== TYPES DE TRAITEMENT =====
export const TRAITEMENT_TYPES = [
  { value: 'systemique', label: 'Traitement systémique' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'radiotherapie', label: 'Radiothérapie' }
]

// ===== SECTIONS ANATOMIQUES =====
export const ANATOMICAL_SECTIONS = [
  {
    id: 'cervico-encephalique',
    label: 'Étage cervico-encéphalique',
    normalPhrase: 'Absence de fixation pathologique cérébrale.',
    icon: '🧠',
    commonAnomalies: [
      'Hyperfixation cérébrale',
      'Adénopathie cervicale',
      'Fixation thyroïdienne',
      'Lésion cérébrale',
      'Adénopathie sus-claviculaire'
    ]
  },
  {
    id: 'thoracique',
    label: 'Étage thoracique',
    normalPhrase: 'Absence de fixation pathologique pleuro-pulmonaire.',
    icon: '🫁',
    commonAnomalies: [
      'Nodule pulmonaire',
      'Adénopathie médiastinale',
      'Épanchement pleural',
      'Masse médiastinale',
      'Adénopathie hilaire'
    ]
  },
  {
    id: 'abdomino-pelvien',
    label: 'Étage abdomino-pelvien',
    normalPhrase: 'Absence de fixation pathologique abdomino-pelvienne.',
    icon: '🫄',
    commonAnomalies: [
      'Lésion hépatique',
      'Lésion péritonéale',
      'Adénopathie rétro-péritonéale',
      'Lésion splénique',
      'Adénopathie iliaque'
    ]
  },
  {
    id: 'osteo-medullaire',
    label: 'Étage ostéo-médullaire et cutané',
    normalPhrase: 'Absence de fixation pathologique ostéo-médullaire ni cutanée.',
    icon: '🦴',
    commonAnomalies: [
      'Lésion osseuse',
      'Lésion cutanée',
      'Multiples fixations osseuses',
      'Atteinte vertébrale',
      'Atteinte costale'
    ]
  }
]
