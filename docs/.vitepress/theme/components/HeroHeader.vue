<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  title: string
  intro?: string
  image?: string
}>()
</script>

<template>
  <div :class="['hero-header', image && 'hero-header--has-image']">
    <div class="container hero-header__content">
      <div class="hero-header__text">
        <h1 class="h1">{{ title }}</h1>
        <p v-if="intro" class="hero-header__intro lead">{{ intro }}</p>
      </div>
      <img v-if="image" class="hero-header__image" :src="withBase(image)" alt="" loading="eager">
    </div>
  </div>
</template>

<style>
.hero-header {
  background-color: var(--yellow-light);
}

.hero-header__content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-40);
  padding-block: var(--spacing-40);
}

@media (min-width: 1100px) {
  .hero-header__content {
    padding-block: var(--spacing-60);
  }
}

.hero-header__text {
  max-width: 50rem;
}

.hero-header__intro {
  max-width: 40rem;
  margin-top: var(--spacing-15);
}

.hero-header__image {
  display: none;
}

@media (min-width: 720px) {
  .hero-header--has-image .hero-header__content {
    padding-bottom: 0;
  }

  .hero-header--has-image .hero-header__text {
    padding-bottom: var(--spacing-40);
  }

  .hero-header__image {
    display: block;
    flex: none;
    width: auto;
    height: 12rem;
  }
}

@media (min-width: 1100px) {
  .hero-header--has-image .hero-header__text {
    padding-bottom: var(--spacing-60);
  }

  .hero-header__image {
    height: 15rem;
  }
}
</style>
