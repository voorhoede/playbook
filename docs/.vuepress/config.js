'use strict';

const path = require('path');

const documentsMetaData = require('../meta-tree.json');

const vuepressPaperPath = require.resolve('vuepress-paper');

const generateSidebar = require(`${vuepressPaperPath}/../generate-sidebar.js`);
const { transformMarkdown } = require(`${vuepressPaperPath}/../transform.js`);

module.exports = {
  title: 'Playbook',
  themeConfig: {
    sidebar: generateSidebar(documentsMetaData),
  },
  extendMarkdown: transformMarkdown(documentsMetaData),
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
                :isHomePage="Boolean($page.frontmatter.home)"
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
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  evergreen: true,
  plugins: [
    [
      require('vuepress-paper'),
    ],
  ],
};
