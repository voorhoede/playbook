<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__content">
      <a class="app-footer__home" :href="withBase('/')">
        <img :src="withBase('/images/logo-with-text.svg')" alt="Playbook home" width="190" height="32">
      </a>
      <p class="app-footer__legal small">
        © De Voorhoede ·
        <a href="https://www.voorhoede.nl" rel="noopener">voorhoede.nl</a>
      </p>
    </div>
  </footer>
</template>

<style>
.app-footer {
  background-color: var(--yellow);
}

.app-footer__content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-20) var(--spacing-40);
  padding-block: var(--spacing-40);
}

.app-footer__home img {
  display: block;
  width: auto;
  height: 1.875rem;
}

.app-footer__legal {
  margin: 0;
}

.app-footer__legal a {
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.app-footer__legal a:hover {
  text-decoration-thickness: 2px;
}
</style>
