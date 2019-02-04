'use strict';

const test = require('ava');
const { Nothing, isJust, Just } = require('sanctuary');
const {
  isPermissionError,
  foldersToPath,
} = require('./main.js')();

const generateSidebar = require('./generate-sidebar.js');
const urlMatchers = require('./url-matchers.js');

test('isPermissionError', t => {
  t.is(isPermissionError({}), Nothing);
  t.is(isPermissionError({ body: { error_summary: 'nope' } }), Nothing);

  t.true(isJust(isPermissionError(
    { body: { error_summary: 'insufficient_permissions' } }
  )));
});

test('foldersToPath', t => {
  const folders = [
    {
      id: 'e.1gg8YzoPEhbTkrhvQwJ2zzxMxerM1EJ5G5cIAQCUvtk08l5Miut8',
      name: 'Playbook',
    },
    {
      id: 'e.1gg8YzoPEhbTkrhvQwJ2zzxMxerM4LNUzL5DSGyTOTXGxKnnDyWb',
      name: 'This is a category',
    },
  ];

  t.is(foldersToPath(folders), 'playbook/this-is-a-category');
  t.is(foldersToPath([ folders[0] ]), 'playbook');
  t.is(foldersToPath([]), '');
});

test('generateSidebar', t => {
  const files = [
    {
      folders: [
        { id: '', name: 'Playbook' },
        { id: '', name: 'Scrum' },
      ],
      location: 'docs/playbook/scrum/one.md',
      content: { metaData: { title: 'one' } },
    },
    {
      folders: [
        { id: '', name: 'Playbook' },
        { id: '', name: 'Scrum' },
      ],
      location: 'docs/playbook/scrum/two.md',
      content: { metaData: { title: 'two' } },
    },
    {
      folders: [
        { id: '', name: 'Playbook' },
        { id: '', name: 'Team' },
      ],
      location: 'docs/playbook/team/uno',
      content: { metaData: { title: 'uno' } },
    },
    {
      folders: [
        { id: '', name: 'Playbook' },
      ],
      location: 'docs/playbook/something',
      content: { metaData: { title: 'something' } },
    },
  ];

  t.deepEqual(
    generateSidebar(files),
    [
      {
        title: 'Scrum',
        children: ['playbook/scrum/one.md','playbook/scrum/two.md'],
      },
      {
        title: 'Team',
        children: ['playbook/team/uno'],
      },
      {
        title: 'Playbook',
        children: ['playbook/something'],
      },
    ]
  );
});

test('generateSidebar ignores readme files', t => {
  const files = [
    {
      folders: [
        { id: '', name: 'Playbook' },
      ],
      location: 'docs/playbook/readme',
      content: { metaData: { title: 'readme' } },
    },
  ];

  t.deepEqual(generateSidebar(files), []);
});

test('generateSidebar ignores double nested files', t => {
  const files = [
    {
      folders: [
        { id: '', name: 'Playbook' },
        { id: '', name: 'Scrum' },
        { id: '', name: 'nope' },
      ],
    },
  ];

  t.deepEqual(generateSidebar(files), []);
});

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
});
