<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const textareaRef = ref(null)

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}

function insertSuggestion(suggestion) {
  const currentValue = props.modelValue
  let newValue = ''

  if (currentValue) {
    // Si il y a déjà du texte, ajouter la suggestion sur une nouvelle ligne
    newValue = currentValue + '\n' + suggestion
  } else {
    // Sinon, juste insérer la suggestion
    newValue = suggestion
  }

  emit('update:modelValue', newValue)

  // Focus sur le textarea après insertion
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}
</script>

<template>
  <div class="anomalie-input">
    <div class="input-section">
      <label for="anomalie-text" class="section-label">Description des anomalies</label>
      <textarea
        id="anomalie-text"
        ref="textareaRef"
        :value="modelValue"
        class="anomalie-textarea"
        rows="8"
        placeholder="Décrivez les anomalies observées sur cette section anatomique..."
        @input="updateValue"
      />
    </div>

    <div v-if="suggestions.length > 0" class="suggestions-section">
      <p class="suggestions-label">💡 Suggestions rapides :</p>
      <div class="suggestions-grid">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-button"
          type="button"
          @click="insertSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
      <p class="suggestions-hint">
        Cliquez sur une suggestion pour l'ajouter au texte
      </p>
    </div>
  </div>
</template>

<style scoped>
.anomalie-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.anomalie-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-primary);
  background: white;
  resize: vertical;
  transition: border-color 0.2s ease;
  line-height: 1.6;
}

.anomalie-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.anomalie-textarea::placeholder {
  color: var(--text-muted);
}

.suggestions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.suggestions-label {
  margin: 0;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.suggestion-button {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-align: left;
  transition: all 0.2s ease;
}

.suggestion-button:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.suggestions-hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

@media (max-width: 768px) {
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
