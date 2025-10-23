<script setup>
import { ref } from 'vue'

defineProps({
  content: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Le compte rendu apparaîtra ici au fur et à mesure de votre saisie...'
  }
})

const copyFeedback = ref(false)

async function copyToClipboard(text) {
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    showCopyFeedback()
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

function showCopyFeedback() {
  copyFeedback.value = true
  setTimeout(() => {
    copyFeedback.value = false
  }, 2000)
}

// Gestion du raccourci Ctrl+Enter
function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    copyToClipboard(content.value)
  }
}

// Exposer la fonction pour l'utiliser depuis le parent si nécessaire
defineExpose({
  copyToClipboard
})
</script>

<template>
  <div class="preview-container" @keydown="handleKeydown" tabindex="-1">
    <div class="preview-header">
      <h2>Prévisualisation</h2>
      <button
        class="btn-primary"
        :disabled="!content"
        @click="copyToClipboard(content)"
        title="Copier dans le presse-papier (Ctrl+Enter)"
      >
        Copier (Ctrl+Enter)
      </button>
    </div>

    <div class="preview-content">
      <div v-if="!content" class="placeholder">
        {{ placeholder }}
      </div>
      <div v-else>
        {{ content }}
      </div>
    </div>

    <!-- Feedback de copie -->
    <Transition name="slide">
      <div v-if="copyFeedback" class="copy-feedback">
        Copié dans le presse-papier !
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Les styles de base sont déjà dans main.css */

/* Animation pour le feedback */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
