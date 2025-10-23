<script setup>
import { ref } from 'vue'

const version = ref('1.0.0')
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <header>
        <h1>Générateur de Comptes Rendus TEP-FDG</h1>
        <div class="header-actions">
          <span style="color: var(--text-secondary); font-size: 0.875rem;">
            v{{ version }}
          </span>
        </div>
      </header>

      <div class="form-container">
        <h2>Application en cours de développement</h2>
        <p style="color: var(--text-secondary); margin-top: 1rem;">
          Phase 1 : Setup projet - Refactoring Vue 3 + Vite
        </p>
        <div style="margin-top: 2rem; padding: 1.5rem; background: var(--background); border-radius: var(--radius);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">État du setup :</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 0.5rem 0; color: var(--success-color);">✓ Projet Vite + Vue 3 initialisé</li>
            <li style="padding: 0.5rem 0; color: var(--success-color);">✓ Configuration vite.config.js</li>
            <li style="padding: 0.5rem 0; color: var(--success-color);">✓ Structure de dossiers créée</li>
            <li style="padding: 0.5rem 0; color: var(--success-color);">✓ Variables CSS migrées</li>
            <li style="padding: 0.5rem 0; color: var(--success-color);">✓ Fichiers de base créés</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

h3 {
  font-size: 1.125rem;
}

li {
  font-weight: 500;
}
</style>
