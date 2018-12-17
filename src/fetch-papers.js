'use strict';

const dotenv = require('dotenv-safe');
const { mkdir, writeFile } = require('fs').promises;
const got = require('got');
const path = require('path');
const promiseAllProps = require('promise-all-props');

const {
  elem,
  filter,
  justs,
  map,
  prop,
  pipe,
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

const {
  fetchAllDocIds,
  getDocFolders,
  fetchDocContent,
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
    .then(docs => Object.entries(docs)
      .map(([ id, folders ]) => promiseAllProps({
        id,
        folders,
        content: fetchDocContent(id),
      }))
    )
    .then(Promise.all.bind(Promise))
    .then(docs => docs.map(doc => ({
      ...doc,
      location: path.join('docs', foldersToPath(doc.folders.slice(1))),
    })))
    .then(docs => docs.map(doc =>
      mkdir(doc.location, { recursive: true })
        .then(() => writeFile(
          path.join(doc.location, `${doc.content.metaData.title}.md`),
          doc.content.body
        ))
    ));
