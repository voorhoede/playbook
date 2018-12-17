'use strict';

const test = require('ava');
const { Nothing, isJust, } = require('sanctuary');
const {
  isPermissionError,
  foldersToPath,
} = require('./main.js')();

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

  t.is(foldersToPath(folders), 'Playbook/This is a category');
  t.is(foldersToPath([ folders[0] ]), 'Playbook');
  t.is(foldersToPath([]), '');
});
