'use strict';

const test = require('ava');
const { Nothing, Just } = require('sanctuary');
const urlMatchers = require('./url-matchers.js');

test('getYoutubeUrlId', t => {
  t.is(
    urlMatchers.getYoutubeUrlId(
      'https://www.voorhoede.com/watch?v=tekS8vw05Qc'
    ),
    Nothing,
    'does not match non-youtube url'
  );

  t.is(
    urlMatchers.getYoutubeUrlId(
      'That https://www.youtube.com/watch?v=tekS8vw05Qc'
    ),
    Nothing,
    'does not match inline youtube url'
  );

  t.deepEqual(
    urlMatchers.getYoutubeUrlId(
      'https://www.youtube.com/watch?v=tekS8vw05Qc'
    ),
    Just('tekS8vw05Qc'),
    'matches complete clean youtube url with www'
  );

  t.deepEqual(
    urlMatchers.getYoutubeUrlId(
      'https://youtube.com/watch?v=tekS8vw05Qc'
    ),
    Just('tekS8vw05Qc'),
    'matches complete clean youtube url without www'
  );

  t.deepEqual(
    urlMatchers.getYoutubeUrlId(
      'https://www.youtube.com/watch?v=tekS8vw05Qc&'
    ),
    Just('tekS8vw05Qc'),
    'matches complete youtube url with extra characters'
  );
});

test('getYoutubePlaylistUrlId', t => {
  t.is(
    urlMatchers.getYoutubePlaylistUrlId(
      'https://www.voorhoede.com/playlist?list=PL597E0BDDC1D74ED2'
    ),
    Nothing,
    'does not match non-youtube url'
  );

  t.is(
    urlMatchers.getYoutubeUrlId(
      'That https://www.youtube.com/watch?v=tekS8vw05Qc'
    ),
    Nothing,
    'does not match inline youtube playlist url'
  );

  t.deepEqual(
    urlMatchers.getYoutubePlaylistUrlId(
      'https://www.youtube.com/playlist?list=PL597E0BDDC1D74ED2'
    ),
    Just('PL597E0BDDC1D74ED2'),
    'matches complete clean youtube playlist url with www'
  );

  t.deepEqual(
    urlMatchers.getYoutubePlaylistUrlId(
      'https://youtube.com/playlist?list=PL597E0BDDC1D74ED2'
    ),
    Just('PL597E0BDDC1D74ED2'),
    'matches complete clean youtube playlist url without www'
  );

  t.deepEqual(
    urlMatchers.getYoutubePlaylistUrlId(
      'https://www.youtube.com/playlist?list=PL597E0BDDC1D74ED2&'
    ),
    Just('PL597E0BDDC1D74ED2'),
    'matches complete youtube playlist url with extra characters'
  );

  t.deepEqual(
    urlMatchers.getYoutubePlaylistUrlId(
      'https://www.youtube.com/playlist?list=PLcp2b-TPWnAc-W2EFGMV9yDcNbjWZucqZ'
    ),
    Just('PLcp2b-TPWnAc-W2EFGMV9yDcNbjWZucqZ'),
    'matches alternate youtube playlist url'
  );
});
