<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(option =>
        typeof option === 'object' &&
        'value' in option &&
        'label' in option
      )
    }
  },
  wrap: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const groupClass = computed(() => ({
  'button-group': true,
  'wrap': props.wrap
}))

function selectOption(value) {
  // Si on clique sur l'option déjà sélectionnée, on la désélectionne
  if (props.modelValue === value) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', value)
  }
}

function isSelected(value) {
  return props.modelValue === value
}
</script>

<template>
  <div :class="groupClass">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="btn-option"
      :class="{ selected: isSelected(option.value) }"
      @click="selectOption(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
/* Les styles sont déjà définis dans main.css */
/* .button-group et .btn-option sont déjà stylés globalement */
</style>
