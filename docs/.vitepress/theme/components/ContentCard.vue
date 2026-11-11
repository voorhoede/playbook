<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  title: string
  href: string
  body?: string
  meta?: string
}>()
</script>

<template>
  <article class="content-card content-card--type content-card--gray-light">
    <div class="content-card__body">
      <div class="content-card__head">
        <h3 class="content-card__title h3">
          <a class="content-card__link" :href="withBase(href)">{{ title }}</a>
        </h3>
        <svg class="content-card__arrow" viewBox="0 0 32 32" width="24" height="24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M18 6L16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6z" />
        </svg>
      </div>
      <p v-if="body" class="content-card__text body">{{ body }}</p>
      <p v-if="meta" class="content-card__meta small">{{ meta }}</p>
    </div>
  </article>
</template>
