<script setup lang="ts">
import { withBase } from 'vitepress'
import type { SidebarItem } from '../navigation'

defineProps<{
  previous?: SidebarItem | null
  next?: SidebarItem | null
}>()
</script>

<template>
  <nav v-if="previous || next" class="breadcrumbs-block" aria-label="Previous and next page">
    <ul class="breadcrumbs-block__nav-list">
      <li v-if="previous" class="breadcrumbs-block__item">
        <a class="breadcrumbs-block__link app-button app-button--secondary body" :href="withBase(previous.link!)" rel="prev">
          ← {{ previous.text }}
        </a>
      </li>
      <li v-if="next" class="breadcrumbs-block__item breadcrumbs-block__item--next">
        <a class="breadcrumbs-block__link app-button app-button--secondary body" :href="withBase(next.link!)" rel="next">
          {{ next.text }} →
        </a>
      </li>
    </ul>
  </nav>
</template>

<style>
.breadcrumbs-block__nav-list {
  display: flex;
  flex-wrap: wrap;
  border-top: 2px solid var(--gray);
}

.breadcrumbs-block__item {
  flex: 1 1 auto;
  margin-top: var(--spacing-15);
  text-align: left;
}

.breadcrumbs-block__item--next {
  margin-left: var(--spacing-30);
  text-align: right;
}

.breadcrumbs-block__link {
  text-align: inherit;
}
</style>
