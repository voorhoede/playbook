<script setup lang="ts">
/** The design system's BreadcrumbsBlock: back to the previous page, on to the next one. */
import { withBase } from 'vitepress'
import type { SidebarItem } from '../navigation'

defineProps<{
  previous?: SidebarItem | null
  next?: SidebarItem | null
}>()
</script>

<template>
  <nav v-if="previous || next" class="breadcrumbs-block" aria-label="Previous and next page">
    <ul :class="['breadcrumbs-block__nav-list', previous && next && 'breadcrumbs-block__nav-list--has-back-and-next-link']">
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
