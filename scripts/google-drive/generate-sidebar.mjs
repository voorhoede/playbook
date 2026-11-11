import folderize from './folderize.cjs'

export default function generateSidebar(metaData) {
  return metaData.files.map(file => mapFileOffspring(file)).sort(sortPages)
}

function mapFileOffspring(file, folderName = '') {
  const text = file.name
  const items = file.children && file.children
    .map(child => mapFileOffspring(child, `${folderName}/${folderize(text)}`))
    .sort(sortPages)
  return items
    ? { text, items }
    : { text, link: `${folderName}/${folderize(text).replace(/\//g, '-')}` }
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
function sortPages(a, b) {
  return collator.compare(a.text.toUpperCase(), b.text.toUpperCase())
}

