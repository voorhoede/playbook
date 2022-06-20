const path = require('path');
const generateSidebar = require('./generate-sidebar');
const transformMarkdown = require('./transform');
const fs = require('fs')

module.exports = {
  getMetaData: async function() {
    return JSON.parse(await fs.promises.readFile(path.resolve(path.resolve(), './playbookFolders.json')))
  },
  generateSidebar,
  drivePlugin: ( ) => ({
    name: 'vuepress-drive',
    extendMarkdown: transformMarkdown,
    plugins: [
      [
        '@vuepress/plugin-register-components',
        {
          components: [
            {
              name: 'youtube-embed',
              path: path.join(__dirname, 'youtube-embed.vue'),
            }
          ]
        }
      ],
    ],
  })
};
