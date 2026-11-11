<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <footer class="playbook-footer">
    <div class="playbook-container playbook-footer__content">
      <a class="playbook-footer__home" :href="withBase('/')">
        <img :src="withBase('/images/logo-with-text.svg')" alt="Playbook home" width="190" height="32">
      </a>
      <p class="playbook-footer__legal small">
        © De Voorhoede ·
        <a href="https://www.voorhoede.nl" rel="noopener">voorhoede.nl</a>
      </p>
    </div>
  </footer>
</template>
