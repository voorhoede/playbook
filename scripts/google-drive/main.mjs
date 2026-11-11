import fs from 'node:fs'
import path from 'node:path'
import generateSidebar from './generate-sidebar.mjs'

export async function getMetaData() {
  return JSON.parse(await fs.promises.readFile(path.resolve('./playbookFolders.json'), 'utf8'))
}

export { generateSidebar }
