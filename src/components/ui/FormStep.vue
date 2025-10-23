<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="active" class="form-step active">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<style scoped>
/* Les styles sont déjà définis dans main.css */
/* .form-step et .form-step.active sont déjà stylés globalement */
</style>
