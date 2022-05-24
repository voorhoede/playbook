const { chain, match, pipe } = require('sanctuary');

const getYoutubeUrlId = pipe([
  match(/^https:\/\/w*\.*youtube\.com\/watch\?v=(\w{11})/),
  chain(match => match.groups[0]),
]);

const getYoutubePlaylistUrlId = pipe([
  match(/^https:\/\/w*\.*youtube\.com\/playlist\?list=([\w\d-]+)/),
  chain(match => match.groups[0]),
]);

module.exports = {
  getYoutubeUrlId,
  getYoutubePlaylistUrlId,
};
