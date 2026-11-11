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

<style>
.playbook-header {
  position: relative;
  z-index: var(--z-index-header);
  background-color: var(--white);
}

.playbook-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-30);
  min-height: var(--app-header-height-small);
}

@media (min-width: 1100px) {
  .playbook-header__content {
    min-height: calc(var(--app-header-height-large) + var(--spacing-10));
  }
}

.playbook-header__home {
  display: block;
}

.playbook-header__logo {
  display: block;
  width: auto;
  height: 1.625rem;
}

@media (min-width: 1100px) {
  .playbook-header__logo {
    height: 2.125rem;
  }
}

.playbook-header__search {
  display: none;
}

@media (min-width: 800px) {
  .playbook-header__search {
    display: block;
    width: min(26rem, 40vw);
  }
}
</style>
