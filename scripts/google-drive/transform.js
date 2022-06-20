const markdownItForInline = require('markdown-it-for-inline');
const urlMatchers = require('./url-matchers.js');

const {
  pipe,
  map,
} = require('sanctuary');


const transformMarkdown = markdown => {
  markdown.use(markdownItForInline, 'youtube-link', 'link_open', (tokens, index) => {
    pipe([
      urlMatchers.getYoutubeUrlId,
      map(id => {
        tokens[index] = {
          'type': 'html_block', 'content': `
              <youtube-embed
                id="${id}"
                type="singleVideo"
              />
            `
        };
        tokens[index + 1].content = '';
      }),
    ])
    (tokens[index].attrs.find(item => item[0] === 'href')[1]);
  });

  markdown.use(markdownItForInline, 'youtube-playlist-link', 'link_open', (tokens, index) => {
    pipe([
      urlMatchers.getYoutubePlaylistUrlId,
      map(id => {
        console.log(id)
        tokens[index] = {
          'type': 'html_block', 'content': `
              <youtube-embed
                id="${id}"
                type="playlist"
              />
            `
        };
        tokens[index + 1].content = '';
      }),
    ])
    (tokens[index].attrs.find(item => item[0] === 'href')[1]);
  });
};


module.exports = transformMarkdown;
