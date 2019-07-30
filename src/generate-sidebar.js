'use strict';

const { filter, map, pipe, props, reduce, sortBy } = require('sanctuary');
const path = require('path');

const generateSidebar = pipe([
  filter (({ content, folders }) =>
    folders.length <= 2 && content.metaData.title !== 'readme'
  ),
  sortBy (props(['content', 'metaData', 'title'])),
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
