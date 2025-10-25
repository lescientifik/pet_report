<script setup>
import { computed } from 'vue'
import { useSectionsState } from '@/composables/useSectionsState'
import { ANATOMICAL_SECTIONS } from '@/utils/constants'

const { activeSection, sections, setActiveSection } = useSectionsState()

// Obtenir le statut visuel de chaque section
function getSectionStatus(sectionId) {
  const sectionState = sections.value[sectionId]

  if (sectionState.status === 'normal') {
    return { icon: '✅', color: 'normal' }
  } else if (sectionState.status === 'anomalie') {
    return { icon: '⚠️', color: 'anomalie' }
  } else if (sectionState.status === 'lesion-cible') {
    return { icon: '🎯', color: 'lesion' }
  }

  return { icon: '', color: 'normal' }
}

function selectSection(sectionId) {
  setActiveSection(sectionId)
}
</script>

<template>
  <div class="section-tabs">
    <button
      v-for="section in ANATOMICAL_SECTIONS"
      :key="section.id"
      class="tab-button"
      :class="{
        active: activeSection === section.id,
        [getSectionStatus(section.id).color]: true
      }"
      @click="selectSection(section.id)"
    >
      <span class="tab-icon">{{ section.icon }}</span>
      <span class="tab-label">{{ section.label }}</span>
      <span class="tab-status">{{ getSectionStatus(section.id).icon }}</span>
    </button>
  </div>
</template>

<style scoped>
.section-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background: var(--background);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-primary);
  text-align: left;
  position: relative;
}

.tab-button:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

/* Couleurs selon le statut */
.tab-button.anomalie:not(.active) {
  border-color: #ff9800;
  background: #fff3e0;
}

.tab-button.lesion:not(.active) {
  border-color: #9c27b0;
  background: #f3e5f5;
}

.tab-icon {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.tab-label {
  flex: 1;
  font-weight: 500;
  line-height: 1.3;
}

.tab-status {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.tab-button.active .tab-status {
  filter: brightness(0) invert(1);
}

@media (max-width: 768px) {
  .section-tabs {
    grid-template-columns: 1fr;
  }

  .tab-button {
    width: 100%;
  }
}
</style>
