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

function sortPages(a, b) {
  const titleA = a.title.toUpperCase()
  const titleB = b.title.toUpperCase()
  if (titleA < titleB) {
    return -1
  }
  if (titleA > titleB) {
    return 1
  }
}

module.exports = generateSidebar
