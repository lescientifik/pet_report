<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    validator: (value) => ['normal', 'anomalie', 'lesion-cible'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const modes = [
  { value: 'normal', label: 'Normal', icon: '✅' },
  { value: 'anomalie', label: 'Anomalie', icon: '⚠️' },
  { value: 'lesion-cible', label: 'Lésion cible', icon: '🎯' }
]

function selectMode(mode) {
  emit('update:modelValue', mode)
}
</script>

<template>
  <div class="mode-selector">
    <button
      v-for="mode in modes"
      :key="mode.value"
      class="mode-button"
      :class="{ active: modelValue === mode.value }"
      @click="selectMode(mode.value)"
    >
      <span class="mode-icon">{{ mode.icon }}</span>
      <span class="mode-label">{{ mode.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.mode-selector {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--background);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.mode-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}

.mode-button:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.mode-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

.mode-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.mode-label {
  line-height: 1;
}

@media (max-width: 768px) {
  .mode-selector {
    flex-direction: column;
  }

  .mode-button {
    width: 100%;
  }
}
</style>
