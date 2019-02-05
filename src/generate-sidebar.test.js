'use strict';

const test = require('ava');
const generateSidebar = require('./generate-sidebar.js');

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
