<script setup lang="ts">
/** The footer on the AppFooter's yellow ground: the logo, and who makes the playbook. */
import { withBase } from 'vitepress'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="playbook-footer">
    <div class="playbook-container playbook-footer__content">
      <a class="playbook-footer__home" :href="withBase('/')">
        <img :src="withBase('/images/logo-with-text.svg')" alt="Playbook home" width="190" height="32">
      </a>
      <p class="playbook-footer__legal small">
        © De Voorhoede {{ year }} ·
        <a href="https://www.voorhoede.nl" rel="noopener">voorhoede.nl</a>
      </p>
    </div>
  </footer>
</template>
