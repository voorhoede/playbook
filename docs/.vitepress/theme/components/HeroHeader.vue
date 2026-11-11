<script setup lang="ts">
/** The design system's HeroHeader in its title-only form: the page's one h1 on yellow-light. */
defineProps<{ title: string }>()
</script>

<template>
  <header class="page-header grid">
    <div class="page-header__text">
      <h1 class="h1">{{ title }}</h1>
    </div>
  </header>
</template>
