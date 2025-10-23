<script setup>
import { ref } from 'vue'

const version = ref('1.0.0-alpha')
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <!-- Header -->
      <header>
        <h1>Générateur de Comptes Rendus TEP-FDG</h1>
        <div class="header-actions">
          <span style="color: var(--text-secondary); font-size: 0.875rem;">
            v{{ version }}
          </span>
        </div>
      </header>

      <!-- Contenu principal (formulaires) -->
      <div class="layout-grid">
        <div class="form-area">
          <slot name="form" />
        </div>

        <div class="preview-area">
          <slot name="preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-area {
  position: sticky;
  top: 2rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .preview-area {
    position: static;
  }
}
</style>
