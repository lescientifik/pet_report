/**
 * Fonctions utilitaires pour formater les différentes parties du compte rendu
 */

import { ANATOMICAL_SECTIONS } from './constants'

// ===== INDICATION =====
export function buildIndicationText(state) {
  const lines = []

  lines.push('INDICATION')

  // Type d'indication
  const indicationLabels = {
    'bilan': 'bilan initial',
    'reevaluation': 'réévaluation',
    'surveillance': 'surveillance',
    'recidive': 'recherche de récidive'
  }
  const indicationText = indicationLabels[state.indication.value] || state.indication.value

  // Construction de la première ligne : Patient(e) de XX ans adressé(e) pour...
  const firstLineParts = []

  // Genre
  const isFemale = state.sexe.value === 'F'
  firstLineParts.push(isFemale ? 'Patiente' : 'Patient')

  // Âge
  if (state.age.value) {
    firstLineParts.push(`de ${state.age.value} ans`)
  }

  // Indication
  firstLineParts.push(isFemale ? 'adressée' : 'adressé')
  firstLineParts.push(`pour ${indicationText}`)

  // Cancer
  if (state.cancer.value) {
    firstLineParts.push(`d'un ${state.cancer.value}`)

    // Détails cancer
    const cancerDetailsText = buildCancerDetailsText(state.cancer.value, state.cancerDetails)
    if (cancerDetailsText) {
      firstLineParts.push(cancerDetailsText)
    }
  }

  firstLineParts.push('.')

  lines.push(firstLineParts.join(' '))

  // Traitements (chaque traitement sur une nouvelle ligne)
  if (state.traitements.value && state.traitements.value.length > 0) {
    state.traitements.value.forEach(traitement => {
      const traitementLine = formatTraitementLine(traitement)
      if (traitementLine) {
        lines.push(traitementLine)
      }
    })
  }

  return lines.join('\n')
}

// Formater une ligne de traitement
function formatTraitementLine(traitement) {
  if (traitement.type === 'systemique') {
    // Traitement systémique débute le XX/XX/XXXX.
    const parts = []
    if (traitement.nom) {
      parts.push(traitement.nom.charAt(0).toUpperCase() + traitement.nom.slice(1))
    } else {
      parts.push('Traitement systémique')
    }

    if (traitement.dateDebut) {
      const date = new Date(traitement.dateDebut)
      const dateFormatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      parts.push(`débuté le ${dateFormatted}.`)
    } else {
      parts.push('.')
    }

    return parts.join(' ')

  } else if (traitement.type === 'chirurgie') {
    // Type de chirurgie le XX/XX/XXXX.
    const parts = []
    if (traitement.nom) {
      parts.push(traitement.nom.charAt(0).toUpperCase() + traitement.nom.slice(1))
    } else {
      parts.push('Chirurgie')
    }

    if (traitement.dateDebut) {
      const date = new Date(traitement.dateDebut)
      const dateFormatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      parts.push(`le ${dateFormatted}.`)
    } else {
      parts.push('.')
    }

    return parts.join(' ')

  } else if (traitement.type === 'radiotherapie') {
    // Radiothérapie localisation du XX/XX/XXXX au XX/XX/XXXX.
    const parts = ['Radiothérapie']

    if (traitement.nom) {
      parts.push(traitement.nom)
    }

    const dates = []
    if (traitement.dateDebut) {
      const date = new Date(traitement.dateDebut)
      dates.push(`du ${date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`)
    }
    if (traitement.dateFin) {
      const date = new Date(traitement.dateFin)
      dates.push(`au ${date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`)
    }

    if (dates.length > 0) {
      parts.push(dates.join(' '))
    }

    parts.push('.')

    return parts.join(' ')
  }

  return ''
}

// ===== DÉTAILS CANCER =====
function buildCancerDetailsText(cancer, details) {
  if (!cancer) return ''

  const cancerLower = cancer.toLowerCase()

  if (cancerLower === 'cancer du sein') {
    return buildSeinDetails(details)
  } else if (cancerLower === 'cancer orl') {
    return buildOrlDetails(details)
  } else if (cancerLower === 'lymphome') {
    return buildLymphomeDetails(details)
  } else if (cancerLower === 'mélanome') {
    return buildMelanomeDetails(details)
  }

  return ''
}

function buildSeinDetails(details) {
  const parts = []

  if (details.cote) {
    parts.push(details.cote)
  }

  if (details.histologie) {
    parts.push(details.histologie)
  }

  if (details.statut) {
    parts.push(details.statut)
  }

  if (details.ki67) {
    parts.push(`Ki67 ${details.ki67}`)
  }

  return parts.length > 0 ? `(${parts.join(', ')})` : ''
}

function buildOrlDetails(details) {
  const parts = []

  if (details.topographie) {
    parts.push(details.topographie)
  }

  if (details.sousLocalisation) {
    parts.push(details.sousLocalisation)
  }

  if (details.hpv && details.hpv !== 'inconnu') {
    parts.push(details.hpv === 'positif' ? 'HPV+' : 'HPV-')
  }

  return parts.length > 0 ? `(${parts.join(', ')})` : ''
}

function buildLymphomeDetails(details) {
  const parts = []

  if (details.type) {
    parts.push(details.type)
  }

  if (details.statut) {
    parts.push(details.statut)
  }

  return parts.length > 0 ? `(${parts.join(', ')})` : ''
}

function buildMelanomeDetails(details) {
  const parts = []

  if (details.site && details.site !== 'inconnu') {
    parts.push(details.site)
  }

  if (details.breslow) {
    parts.push(`Breslow ${details.breslow}`)
  }

  return parts.length > 0 ? `(${parts.join(', ')})` : ''
}

// ===== RÉSULTATS =====
export function buildResultsText(state, sectionsState = null) {
  const parts = []

  parts.push('RÉSULTATS')

  // Comparaisons TEP antérieurs
  if (state.comparaisons.value && state.comparaisons.value.length > 0) {
    parts.push('\n\nComparaison avec TEP antérieur(s) :')

    state.comparaisons.value.forEach(comp => {
      const typeLabel = comp.type ? ` (${comp.type})` : ''
      const dateText = comp.date ? ` du ${comp.date}` : ''
      const commentaire = comp.commentaire ? ` : ${comp.commentaire}` : ''
      parts.push(`\n- TEP${typeLabel}${dateText}${commentaire}`)
    })

    parts.push('\n')
  }

  // Si sections state fourni, générer par sections anatomiques
  if (sectionsState && sectionsState.sections) {
    parts.push('\n')

    ANATOMICAL_SECTIONS.forEach(section => {
      const sectionState = sectionsState.sections.value[section.id]
      const sectionText = buildResultsSection(section, sectionState)

      if (sectionText) {
        parts.push(`\n${section.label} :`)
        parts.push(`\n${sectionText}`)
      }
    })
  } else {
    // Fallback : résultats saisis en texte libre (ancien mode)
    if (state.resultats.value) {
      if (state.comparaisons.value && state.comparaisons.value.length > 0) {
        parts.push('\n')
      } else {
        parts.push('\n\n')
      }
      parts.push(state.resultats.value)
    }
  }

  return parts.join('')
}

// Construire le texte pour une section anatomique
function buildResultsSection(section, sectionState) {
  if (!sectionState) return ''

  if (sectionState.status === 'normal') {
    return section.normalPhrase
  }

  if (sectionState.status === 'anomalie' && sectionState.text) {
    return sectionState.text
  }

  if (sectionState.status === 'lesion-cible' && sectionState.lesions.length > 0) {
    const lines = []
    sectionState.lesions.forEach((lesion, idx) => {
      let line = `Lésion cible ${idx + 1} : ${lesion.localisation}`
      line += `, SUVmax ${lesion.suvmax}`
      if (lesion.volume) {
        line += `, volume métabolique ${lesion.volume} ml`
      }
      line += '.'
      lines.push(line)
    })
    return lines.join('\n')
  }

  // Si aucun contenu, retourner la phrase normale par défaut
  return section.normalPhrase
}

// ===== CONCLUSION =====
export function buildConclusionText(state) {
  if (!state.conclusion.value) {
    return ''
  }

  return `CONCLUSION\n\n${state.conclusion.value}`
}

// ===== RAPPORT COMPLET =====
export function buildFullReport(state, sectionsState = null) {
  const sections = []

  // Section Indication
  if (state.isComplete?.value || (state.indication.value && state.cancer.value)) {
    sections.push(buildIndicationText(state))
  }

  // Section Résultats
  // Si sectionsState fourni, toujours générer (même si tout est normal)
  // Sinon, seulement si résultats saisis
  const shouldBuildResults = sectionsState
    ? true
    : (state.resultats.value || (state.comparaisons.value && state.comparaisons.value.length > 0))

  if (shouldBuildResults) {
    sections.push(buildResultsText(state, sectionsState))
  }

  // Section Conclusion
  if (state.conclusion.value) {
    sections.push(buildConclusionText(state))
  }

  return sections.join('\n\n')
}
