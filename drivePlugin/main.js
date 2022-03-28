const path = require('path');
const generateSidebar = require('./generate-sidebar');
const transformMarkdown = require('./transform');
const fs = require('fs')

module.exports = {
  getMetaData: async function() {
    return JSON.parse(await fs.promises.readFile(path.resolve(path.resolve(), './playbookFolders.json')))
  },
  generateSidebar,
  drivePlugin: ({ documentsMetaData }) => ({
    name: 'vuepress-paper',
    extendMarkdown: transformMarkdown(documentsMetaData),
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
