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
