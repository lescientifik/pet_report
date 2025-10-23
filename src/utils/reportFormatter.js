/**
 * Fonctions utilitaires pour formater les différentes parties du compte rendu
 */

// ===== INDICATION =====
export function buildIndicationText(state) {
  const parts = []

  // Type d'indication
  const indicationLabels = {
    'bilan': 'bilan initial',
    'reevaluation': 'réévaluation',
    'surveillance': 'surveillance',
    'recidive': 'recherche de récidive'
  }
  const indicationText = indicationLabels[state.indication.value] || state.indication.value

  // Construction de la phrase d'indication
  parts.push(`INDICATION\nTEP-scan au 18-FDG réalisé dans le cadre du ${indicationText}`)

  // Ajout du cancer
  if (state.cancer.value) {
    parts.push(` d'un ${state.cancer.value}`)
  }

  // Ajout des détails spécifiques au cancer
  const cancerDetailsText = buildCancerDetailsText(state.cancer.value, state.cancerDetails)
  if (cancerDetailsText) {
    parts.push(` ${cancerDetailsText}`)
  }

  // Informations patient
  const patientInfo = []
  if (state.age.value) {
    patientInfo.push(`${state.age.value} ans`)
  }
  if (state.sexe.value) {
    const sexeLabel = state.sexe.value === 'M' ? 'homme' : 'femme'
    patientInfo.push(sexeLabel)
  }

  if (patientInfo.length > 0) {
    parts.push(` chez un${state.sexe.value === 'F' ? 'e' : ''} patient${state.sexe.value === 'F' ? 'e' : ''} de ${patientInfo.join(', ')}`)
  }

  // Traitement en cours
  if (state.traitement.value) {
    const dateText = state.dateTraitement.value ? ` (${state.dateTraitement.value})` : ''
    parts.push(`, actuellement sous ${state.traitement.value}${dateText}`)
  }

  parts.push('.')

  return parts.join('')
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
export function buildResultsText(state) {
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

  // Résultats saisis
  if (state.resultats.value) {
    if (state.comparaisons.value && state.comparaisons.value.length > 0) {
      parts.push('\n')
    } else {
      parts.push('\n\n')
    }
    parts.push(state.resultats.value)
  }

  return parts.join('')
}

// ===== CONCLUSION =====
export function buildConclusionText(state) {
  if (!state.conclusion.value) {
    return ''
  }

  return `CONCLUSION\n\n${state.conclusion.value}`
}

// ===== RAPPORT COMPLET =====
export function buildFullReport(state) {
  const sections = []

  // Section Indication
  if (state.isComplete?.value || (state.indication.value && state.cancer.value)) {
    sections.push(buildIndicationText(state))
  }

  // Section Résultats
  if (state.resultats.value || (state.comparaisons.value && state.comparaisons.value.length > 0)) {
    sections.push(buildResultsText(state))
  }

  // Section Conclusion
  if (state.conclusion.value) {
    sections.push(buildConclusionText(state))
  }

  return sections.join('\n\n')
}
