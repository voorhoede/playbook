'use strict';

const { readFileSync } = require('fs');
const generateSidebar = require('../../src/generate-sidebar.js');

module.exports = {
  title: 'Playbook',
  themeConfig: {
    sidebar: generateSidebar(JSON.parse(readFileSync('docs/dump.json'))),
  },
  dest: './dist',
  evergreen: true,
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: false,
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
};
