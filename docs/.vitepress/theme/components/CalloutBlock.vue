<script setup lang="ts">
defineProps<{
  title?: string
  headingLevel?: 2 | 3
}>()
</script>

<template>
  <aside class="callout">
    <div class="callout__text">
      <component :is="`h${headingLevel ?? 2}`" v-if="title" class="callout__title h3">{{ title }}</component>
      <div v-if="$slots.default" class="callout__body lead">
        <slot />
      </div>
      <div v-if="$slots.actions" class="callout__actions">
        <slot name="actions" />
      </div>
    </div>
  </aside>
</template>
