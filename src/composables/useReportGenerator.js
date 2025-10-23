import { computed } from 'vue'
import { useReportState } from './useReportState'
import { buildFullReport } from '@/utils/reportFormatter'

export function useReportGenerator() {
  const state = useReportState()

  // Génération du rapport complet en temps réel
  const report = computed(() => {
    return buildFullReport(state)
  })

  // Vérifie si le rapport a du contenu
  const hasContent = computed(() => {
    return report.value.trim().length > 0
  })

  // Nombre de caractères
  const characterCount = computed(() => {
    return report.value.length
  })

  // Nombre de mots
  const wordCount = computed(() => {
    return report.value.trim().split(/\s+/).filter(word => word.length > 0).length
  })

  // Copie dans le presse-papier
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(report.value)
      return { success: true, message: 'Copié dans le presse-papier !' }
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
      return { success: false, message: 'Erreur lors de la copie' }
    }
  }

  return {
    report,
    hasContent,
    characterCount,
    wordCount,
    copyToClipboard
  }
}
