<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  title: string
  intro?: string
  image?: string
}>()
</script>

<template>
  <div :class="['playbook-hero', image && 'playbook-hero--has-image']">
    <div class="playbook-container playbook-hero__content">
      <div class="playbook-hero__text">
        <h1 class="h1">{{ title }}</h1>
        <p v-if="intro" class="playbook-hero__intro lead">{{ intro }}</p>
      </div>
      <img v-if="image" class="playbook-hero__image" :src="withBase(image)" alt="" loading="eager">
    </div>
  </div>
</template>

<style>
.playbook-hero {
  background-color: var(--yellow-light);
}

.playbook-hero__content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-40);
  padding-block: var(--spacing-40);
}

@media (min-width: 1100px) {
  .playbook-hero__content {
    padding-block: var(--spacing-60);
  }
}

.playbook-hero__text {
  max-width: 50rem;
}

.playbook-hero__intro {
  max-width: 40rem;
  margin-top: var(--spacing-15);
}

.playbook-hero__image {
  display: none;
}

@media (min-width: 720px) {
  .playbook-hero--has-image .playbook-hero__content {
    padding-bottom: 0;
  }

  .playbook-hero--has-image .playbook-hero__text {
    padding-bottom: var(--spacing-40);
  }

  .playbook-hero__image {
    display: block;
    flex: none;
    width: auto;
    height: 12rem;
  }
}

@media (min-width: 1100px) {
  .playbook-hero--has-image .playbook-hero__text {
    padding-bottom: var(--spacing-60);
  }

  .playbook-hero__image {
    height: 15rem;
  }
}
</style>
