'use strict';

const { readFileSync } = require('fs');
const generateSidebar = require('../../src/generate-sidebar.js');

module.exports = {
  dest: './dist',
  evergreen: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'De Voorhoede', link: 'https://voorhoede.nl/' },
    ],
    sidebar: generateSidebar(JSON.parse(readFileSync('docs/dump.json'))),
  },
};
