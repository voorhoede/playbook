<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <aside class="callout">
    <div class="callout__text">
      <h2 class="callout__title h3">{{ title }}</h2>
      <div class="callout__body lead">
        <slot />
      </div>
    </div>
  </aside>
</template>
