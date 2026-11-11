<script setup lang="ts">
/** The design system's CardGrid: an h2 title and one action over columns of cards. */
defineProps<{
  title?: string
  intro?: string
  columns?: 1 | 2 | 3
}>()
</script>

<template>
  <section class="card-grid grid">
    <div v-if="title || $slots.action" class="card-grid__head">
      <div>
        <h2 v-if="title" class="card-grid__title h2">{{ title }}</h2>
        <p v-if="intro" class="card-grid__intro lead">{{ intro }}</p>
      </div>
      <slot name="action" />
    </div>
    <ul :class="['card-grid__list', `card-grid__list--${columns ?? 3}`]">
      <slot />
    </ul>
  </section>
</template>
