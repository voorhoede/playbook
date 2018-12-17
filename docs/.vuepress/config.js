const readdirRecursive = require('fs-readdir-recursive');
const { parse } = require('path');

module.exports = {
  dest: './dist',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'De Voorhoede', link: 'https://voorhoede.nl/' },
    ],
    sidebar: readdirRecursive('./docs/')
      .filter(path => parse(path).name !== 'readme')
      .sort((pathA, pathB) =>
        parse(pathA).name.localeCompare(parse(pathB).name)
      ),
  },
};
