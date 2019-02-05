'use strict';

const path = require('path');
const { kebabCaseIt } = require('case-it');

const {
  chain,
  curry2,
  compose,
  gets,
  match,
  map,
  Nothing,
  prop,
  pipe,
  reduce,
} = require('sanctuary');

const foldersToPath = pipe([
  map (compose (kebabCaseIt) (prop('name')) ),
  reduce (curry2(path.join)) (''),
]);

const isPermissionError = pipe([
  gets (Boolean) (['body', 'error_summary']),
  chain(match(/insufficient_permissions/)),
]);

const fetchPaginatedDocIds = apiFetch => previousDocIds => ({
  body: { doc_ids: docIds, cursor, has_more: hasMore },
}) =>
  hasMore
    ? apiFetch('/docs/list/continue', {
      body: { cursor },
    })
      .then(fetchPaginatedDocIds (apiFetch) (previousDocIds.concat(docIds)))
    : previousDocIds.concat(docIds);

const fetchAllDocIds = apiFetch => () => apiFetch('/docs/list', {})
  .then(fetchPaginatedDocIds (apiFetch) ([]));

const fetchDocFolders = apiFetch => docId => apiFetch(
  '/docs/get_folder_info',
  { body: { doc_id: docId } }
)
  .then(gets (Boolean) (['body', 'folders']))
  .catch(response =>
    isPermissionError(response) === Nothing
      ? Promise.reject(response)
      : Promise.resolve(Nothing)
  );

const fetchDocContent = apiFetch => docId => apiFetch(
  '/docs/download',
  {
    headers: { 'Dropbox-API-Arg': JSON.stringify({
      doc_id: docId,
      export_format: 'markdown',
    })},
    json: false,
  }
)
  .then(({ body, headers: { 'dropbox-api-result': metaData }}) => ({
    metaData: JSON.parse(metaData),
    body,
  }));

const fetchDocMetaData = apiFetch => docId => apiFetch(
  '/docs/get_metadata',
  { body: { doc_id: docId } }
)
  .then(({ body }) => body);

module.exports = apiFetch => ({
  isPermissionError,
  foldersToPath,
  fetchAllDocIds: fetchAllDocIds(apiFetch),
  fetchDocFolders: fetchDocFolders(apiFetch),
  fetchDocContent: fetchDocContent(apiFetch),
  fetchDocMetaData: fetchDocMetaData(apiFetch),
});
