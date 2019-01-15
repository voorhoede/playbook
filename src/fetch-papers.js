'use strict';

const { kebabCaseIt } = require('case-it');
const dotenv = require('dotenv-safe');
const { mkdir, writeFile } = require('fs').promises;
const got = require('got');
const path = require('path');
const promiseAllProps = require('promise-all-props');

const {
  elem,
  equals,
  filter,
  justs,
  map,
  prop,
  props,
  pipe,
  reject,
} = require('sanctuary');

const main = require('./main.js');

dotenv.config();

const dropboxPaperApi = got.extend({
  method: 'POST',
  baseUrl: 'https://api.dropbox.com/2/paper/',
  json: true,
  headers: {
    Authorization: `Bearer ${process.env.DROPBOX_API_TOKEN}`,
  },
});

const jsonToFrontmatter = json => `---\n${ JSON.stringify(json, null, 2) }\n---\n`;

const isDeletedDoc = pipe([
  props(['metaData', 'status', '.tag']),
  equals('deleted'),
]);

const {
  fetchAllDocIds,
  getDocFolders,
  fetchDocContent,
  fetchDocMetaData,
  foldersToPath,
} = main(dropboxPaperApi);

fetchAllDocIds()
    .then(docIds => docIds.reduce((docs, id) => ({
      ...docs,
      [id]: getDocFolders(id),
    }), {}))
    .then(promiseAllProps)
    .then(justs)
    .then(filter (pipe([
      map(prop('id')),
      elem(process.env.DROPBOX_PAPER_DIRECTORY_ID),
    ])))
    .then(Object.entries)
    .then(docs => docs.map(([ id, folders ]) => promiseAllProps({
      id,
      folders,
      directory: path.join('docs', foldersToPath(folders.slice(1))),
      metaData: fetchDocMetaData(id),
    })))
    .then(Promise.all.bind(Promise))
    .then(reject(isDeletedDoc))
    .then(docs => docs.map(doc =>
      promiseAllProps({
        ...doc,
        content: fetchDocContent(doc.id),
      })
        .then(doc => ({
          ...doc,
          location: path.join(
            doc.directory,
            `${kebabCaseIt(doc.content.metaData.title)}.md`
          ),
        }))
    ))
    .then(Promise.all.bind(Promise))
    .then(docs => docs.forEach(doc => {
      mkdir(doc.directory, { recursive: true })
        .then(() => writeFile(
          doc.location,
          `${jsonToFrontmatter(doc.metaData)}${doc.content.body}`
        ));
      writeFile('docs/dump.json', JSON.stringify(docs));
    }));
