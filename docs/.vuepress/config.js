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
  evergreen: true,
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: false,
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: 'manifest.json' }],
    ['meta', { name: 'theme-color', content: manifest.theme_color }],
  ],
};
