const folderize = require('./folderize.cjs')

function generateSidebar(metaData) {
  return metaData.files.map(file => mapFileOffspring(file)).sort(sortPages)
}

function mapFileOffspring(file, folderName = '') {
  const title = file.name
  const children = file.children && file.children.map(child => mapFileOffspring(child, `${folderName}/${folderize(title)}`)).sort(sortPages)
  const path = !children && `${folderName}/${folderize(title).replace(/\//g, '-')}`
  return {
    title,
    ...(children ? {children} : {}),
    ...(path ? {path} : {})
  }
}

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
function sortPages(a, b) {
  const titleA = a.title.toUpperCase()
  const titleB = b.title.toUpperCase()
  return collator.compare(titleA, titleB)
}

module.exports = generateSidebar
