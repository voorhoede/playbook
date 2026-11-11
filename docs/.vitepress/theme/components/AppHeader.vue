<script setup lang="ts">
/**
 * The site header: the De Voorhoede logo with the playbook's name, and the search from 800px.
 * Built on the AppHeader of the design system, on a white ground above the page header.
 */
import { withBase } from 'vitepress'
import SearchBox from './SearchBox.vue'
</script>

<template>
  <header class="playbook-header">
    <div class="playbook-container playbook-header__content">
      <a class="playbook-header__home" :href="withBase('/')">
        <img class="playbook-header__logo" :src="withBase('/images/logo-with-text.svg')" alt="De Voorhoede" width="190" height="32">
        <span class="playbook-header__name h3 font-normal">Playbook</span>
      </a>
      <SearchBox class="playbook-header__search" shortcut />
    </div>
  </header>
</template>
