'use strict';

const { filter, pipe, map, reduce } = require('sanctuary');
const path = require('path');

const generateSidebar = pipe([
  filter (({ content, folders }) =>
   (folders.length <= 2) && (content.metaData.title !== 'readme')
  ),
  reduce (docs => doc => {
    const containingFolder = doc.folders[doc.folders.length - 1].name;
    return {
      ...docs,
      [containingFolder]: [
        ...docs[containingFolder] || [],
        path.relative('docs', doc.location),
      ],
    };
  }) ({}),
  Object.entries,
  map (([key, value]) => ({
    'title': key,
    'children': value,
  })),
]);

module.exports = generateSidebar;
