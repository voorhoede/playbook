const folderize = name => name.replaceAll(' ', '-')

function generateSidebar(metaData) {
  const sidebar = metaData.files.map(file => mapFileOffspring(file))
  console.log(JSON.stringify(sidebar, null, 4));
  return sidebar
}

function mapFileOffspring(file, folderName = '') {
  const title = file.name
  const children = file.children && file.children.map(child => mapFileOffspring(child, `${folderName}/${folderize(title)}`))
  const path = !children && `${folderName}/${folderize(title)}`
  return {
    title,
    ...(children ? {children} : {}),
    ...(path ? {path} : {})
  }
}

module.exports = generateSidebar;
