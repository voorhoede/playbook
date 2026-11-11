<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <aside class="callout-block">
    <h2 class="callout-block__title h3">{{ title }}</h2>
    <div class="callout-block__body lead">
      <slot />
    </div>
  </aside>
</template>

<style>
.callout-block {
  padding: var(--spacing-30);
  background-color: var(--yellow-light);
}

.callout-block__body {
  margin-top: var(--spacing-10);
}

.callout-block__body > * + * {
  margin-top: var(--spacing-15);
}
</style>
