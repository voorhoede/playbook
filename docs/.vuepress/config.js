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
};
