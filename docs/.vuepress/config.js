'use strict';

const { readFileSync } = require('fs');
const generateSidebar = require('../../src/generate-sidebar.js');
const manifest = require('./public/manifest.json')

module.exports = {
  title: 'Playbook',
  themeConfig: {
    sidebar: generateSidebar(JSON.parse(readFileSync('docs/dump.json'))),
  },
  dest: './dist',
  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json', crossorigin: "use-credentials" }],
    ['meta', { name: 'theme-color', content: manifest.theme_color }],
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true,
    }
  },
  evergreen: true,
};
