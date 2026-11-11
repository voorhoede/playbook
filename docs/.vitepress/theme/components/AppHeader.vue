<script setup lang="ts">
/** The design system's AppHeader: the logo and the playbook's name, with search from 800px. */
import { withBase } from 'vitepress'
import SearchBox from './SearchBox.vue'
</script>

<template>
  <header class="app-header grid">
    <div class="app-header__content">
      <a class="app-header__home-link playbook-header__home" :href="withBase('/')">
        <img class="app-header__logo" :src="withBase('/images/logo-with-text.svg')" alt="" width="190" height="32">
        <span class="playbook-header__name body font-bold">Playbook</span>
        <span class="sr-only">, home</span>
      </a>
      <div class="app-header__link-lists small">
        <SearchBox class="playbook-header__search" />
      </div>
    </div>
  </header>
</template>
