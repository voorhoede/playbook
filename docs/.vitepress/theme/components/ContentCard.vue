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
  <article class="content-card">
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

<style>
.content-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--gray-light);
  color: var(--black);
}

.content-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--spacing-30);
}

/* The title, with the arrow at the end of its first line. */
.content-card__head {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-15);
}

.content-card__link::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-index-raised);
}

.content-card__link:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: .15em;
}

.content-card__link:focus-visible {
  outline: none;
}

.content-card__link:focus-visible::after {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

.content-card__text {
  margin-top: var(--spacing-10);
}

.content-card__meta {
  margin-top: auto;
  padding-top: var(--spacing-30);
}

.content-card__arrow {
  flex: none;
  margin-left: auto;
  margin-top: calc((1lh - 24px) / 2);
  font-size: clamp(1.5rem, 1.269rem + 1.154vw, 2.0625rem);
  line-height: 1.3;
  color: var(--blue);
  transition: transform .15s cubic-bezier(.3, .51, .09, 1);
}

.content-card:hover .content-card__arrow,
.content-card:focus-within .content-card__arrow {
  transform: translateX(.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .content-card__arrow {
    transition: none;
  }
}
</style>
