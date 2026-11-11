<script setup lang="ts">
import { withBase } from 'vitepress'
import SearchBox from './SearchBox.vue'
</script>

<template>
  <header class="playbook-header">
    <div class="playbook-container playbook-header__content">
      <a class="playbook-header__home" :href="withBase('/')">
        <img class="playbook-header__logo" :src="withBase('/images/logo-with-text.svg')" alt="Playbook home" width="190" height="32">
      </a>
      <SearchBox class="playbook-header__search" shortcut />
    </div>
  </header>
</template>
