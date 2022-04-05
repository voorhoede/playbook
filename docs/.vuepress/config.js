const dotenv = require('dotenv-safe');
const { generateSidebar, drivePlugin, getMetaData } = require( '../../scripts/google-drive/main');

dotenv.config();

module.exports = () => getMetaData()
  .then(documentsMetaData => ({
    title: 'Playbook',
    themeConfig: {
      sidebar: generateSidebar(documentsMetaData),
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
        drivePlugin,
        { documentsMetaData }
      ]
    ],
  }));
