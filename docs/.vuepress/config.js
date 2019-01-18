'use strict';

const { readFileSync } = require('fs');
const generateSidebar = require('../../src/generate-sidebar.js');
const manifest = require('./public/manifest.json');

module.exports = {
  title: 'Playbook',
  themeConfig: {
    sidebar: generateSidebar(JSON.parse(readFileSync('docs/dump.json'))),
  },
  chainMarkdown (config) {
    config.plugin('add-metadata')
      .use(markdown => {
        markdown.core.ruler.push('add-metadata', state => {
          state.tokens.unshift({
            'type': 'html_block',
            'content': `
              <metadata
                :id="$page.frontmatter.doc_id"
                :date="$page.frontmatter.last_updated_date"
                :isHomePage="$page.frontmatter.home"
              />
            `,
          });

          return state;
        });
      })
      .before('component');
  },
  dest: './dist',
  head: [
    ['link', { rel: 'icon', href: '/icons/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json', crossorigin: 'use-credentials' }],
    ['meta', { name: 'theme-color', content: manifest.theme_color }],
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: false,
    }
  },
  evergreen: true,
};
