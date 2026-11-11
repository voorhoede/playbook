<script setup lang="ts">
/**
 * The playbook's footer on the AppFooter's yellow ground: the logo, the playbook's sections
 * and the copyright line. The company details of the site's AppFooter don't belong here.
 */
import { withBase } from 'vitepress'
import { firstLink, useNavigation } from '../navigation'

const { sidebar } = useNavigation()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="playbook-footer grid">
    <div class="playbook-footer__layout">
      <a class="playbook-footer__home" :href="withBase('/')">
        <img :src="withBase('/images/logo-with-text.svg')" alt="Playbook home" width="190" height="32">
      </a>
      <nav class="playbook-footer__nav" aria-label="Playbook sections">
        <ul class="playbook-footer__links body">
          <li v-for="item in sidebar" :key="item.text">
            <a class="link" :href="withBase(firstLink(item) ?? '/')">{{ item.text }}</a>
          </li>
        </ul>
      </nav>
      <p class="playbook-footer__legal small">
        © De Voorhoede {{ year }} ·
        <a class="link" href="https://www.voorhoede.nl" rel="noopener">voorhoede.nl</a>
      </p>
    </div>
  </footer>
</template>
