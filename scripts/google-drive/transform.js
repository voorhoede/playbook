const path = require('path');
const markdownItForInline = require('markdown-it-for-inline');
const urlMatchers = require('./url-matchers.js');

const {
  chain,
  compose,
  find,
  pipe,
  prop,
  map,
  match,
} = require('sanctuary');

const getDropboxDocumentLocation = documentsMetaData => pipe([
  match(/paper\.dropbox\.com\/doc\/.+--\S{26}-(\w{21})/),
  chain(match => match.groups[0]),
  chain(urlId => find (doc => doc.id === urlId) (documentsMetaData)),
  map(compose (path.parse) (prop('location'))),
]);



const transformMarkdown = documentsMetaData => markdown => {
  // markdown.use(markdownItForInline, 'internal-link', 'link_open', (tokens, index) => {
  //   const token = tokens[index];
  //
  //   pipe([
  //     getDropboxDocumentLocation(documentsMetaData),
  //     map(location => {
  //       token.attrSet(
  //         'href',
  //         `/${path.parse(location.dir).name}/${location.name}.html`
  //       );
  //     }),
  //   ])
  //   (token.attrGet('href'));
  // });

  markdown.use(markdownItForInline, 'youtube-link', 'text', (tokens, index) => {
    pipe([
      urlMatchers.getYoutubeUrlId,
      map(id => {
        tokens[index] = {
          'type': 'html_block',
          'content': `
              <youtube-embed
                id="${id}"
                type="singleVideo"
              />
            `
        };
      }),
    ])
    (tokens[index].content);
  });

  markdown.use(markdownItForInline, 'youtube-playlist-link', 'text', (tokens, index) => {
    pipe([
      urlMatchers.getYoutubePlaylistUrlId,
      map(id => {
        tokens[index] = {
          'type': 'html_block',
          'content': `
              <youtube-embed
                id="${id}"
                type="playlist"
              />
            `
        };
      }),
    ])
    (tokens[index].content);
  });
};


module.exports = transformMarkdown;
