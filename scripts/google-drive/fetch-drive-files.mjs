import fs from 'fs';
import {google} from 'googleapis'
import {config} from 'dotenv-safe';
import path from 'path'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import remarkGfm from 'remark-gfm'
import folderize from './folderize.cjs'
import getCredentials from './credentials.cjs'
import {visit} from 'unist-util-visit'
import {h} from 'hastscript'
import qs from 'qs'

config();
const {GOOGLE_PLAYBOOK_FOLDER_NAME} = process.env;
const processor = unified()
  .use(rehypeParse)
  .use(rehypeTransformUrls)
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify)

/** @type {import('unified').Plugin<[], import('hast').Root>} */
function rehypeTransformUrls() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties?.href?.startsWith('https://www.google.com/url')) {
        const params = qs.parse(new URL(node.properties.href).search.substring(1))
        node.properties.href = params.q
      } else if (node.tagName === 'span' && node.properties?.style?.includes('font-weight:700')){
        node.tagName = 'strong'
      } else if (node.tagName === 'table') {
        const theadTr = node.children.find(child => child.tagName === 'tbody').children.shift()
        node.children.unshift(h('thead', theadTr))
      }
    })
  }
}

/**
 * Retrieves doc files from google drive and saves them to file system as markdown
 */
getCredentials().then(credentials => {
  authorize(credentials, retrieveContentFromDrive);
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/documents',
    ]);
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully connected!");
      callback(jwtClient);
    }
  });
}

/**
 * Read the playbook folder json or fetch it from drive and write all files to the docs folder
 * @param {google.auth.JWT} auth An authorized OAuth2 client.
 */
function retrieveContentFromDrive(auth) {
  const drive = google.drive('v3');
  fs.readFile(path.resolve(path.resolve(), './playbookFolders.json'), async (err, pathsBuffer) => {
    if (err) {
      return getPlaybookFolderFromDrive(drive, auth);
    } else {
      const paths = JSON.parse(pathsBuffer);
      const files = await listFilesAndFolders(drive, auth, paths);
      const contents = await getFileContents(drive, auth, files);
      ensureDirectoryExistence('./docs')
      await Promise.all(contents.map(async content => {
        const data = await createWritableMarkdownString(content)
        ensureDirectoryExistence(`./docs${folderize(content.folderName)}`)
        return fs.promises.writeFile(
          `./docs${folderize(content.folderName)}/${folderize(content.name).replace(/\//g, '-')}.md`,
          data)
      }))
      return paths
    }
  })
}

/**
 *
 * @param drive
 * @param auth
 * @param files
 * @returns {Promise<Awaited<unknown>[]>}
 */
async function getFileContents(drive, auth, files) {
  // return data
  const flattenFilesObject = (data, folderName) => data.map(d => {
    return [{
      ...d,
      folderName
    }, ...(d.children
      ? flattenFilesObject(
        d.children, `${folderName
          ? folderize(folderName)
          : ''}/${folderize(d.name)}`)
      : [])]
  }).flat()
  const documents = flattenFilesObject(files).filter(file => file.mimeType === 'application/vnd.google-apps.document')
  return  Promise.all(documents.map(async (document) => {
    const res = await drive.files.export({
      fileId: document.id,
      mimeType: 'text/html',
      auth
    })
    return {...document, html: res.data}
  }))
}

/**
 *
 * @param drive
 * @param auth
 * @param paths
 * @returns {Promise<void>}
 */
async function listFilesAndFolders(drive, auth, paths) {
  const files = await getFolderContents(drive, auth, paths.root.id);
  const allFiles = await getRecursiveFolderContents(drive, auth, files);
  fs.promises.writeFile(path.resolve(path.resolve(), './playbookFolders.json'), JSON.stringify({root: paths.root, files: allFiles})).then (err => {
    if (err) return console.error(err);
    console.log('written files to playbookFolders.json');
  })
  return allFiles
}

/**
 *
 * @param drive
 * @param auth
 * @param folderId
 * @returns {*}
 */
function getFolderContents(drive, auth, folderId) {
  return drive.files.list({
    q: `'${folderId}' in parents`, spaces: 'drive', pageSize: 100,
    fields: '*',
    auth
  }).then((res, err) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      return files;
    } else {
      console.log('No files found.');
      return null;
    }
  })
}

/**
 *
 * @param drive
 * @param auth
 * @param files
 * @returns {Promise<Awaited<unknown>[]>}
 */
function getRecursiveFolderContents(drive, auth, files) {
  return Promise.all(files.map(async file => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const folder = await getFolderContents(drive, auth, file.id)
      const children = await getRecursiveFolderContents(drive, auth, folder)
      return {...file, children}
    } else {
      return file
    }
  }))
}

/**
 * Find the playbook root folder
 * @param drive Authorized drive instance v3
 * @param auth
 */
function getPlaybookFolderFromDrive(drive, auth) {
  drive.files.list({
    q: `name = "${GOOGLE_PLAYBOOK_FOLDER_NAME}"`, spaces: 'drive', auth
  }, function (err, res) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      const root = res.data.files.find(file => file.name === GOOGLE_PLAYBOOK_FOLDER_NAME)
      fs.writeFile(path.resolve(path.resolve(), './playbookFolders.json'), JSON.stringify({root}), (err) => {
        if (err) return console.error(err);
        console.log('root stored to playbookFolders.json');
        retrieveContentFromDrive(auth)
      });
    }
  })
}

/**
 *
 * @param dirname
 * @returns {boolean}
 */
function ensureDirectoryExistence(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname);
}

async function createWritableMarkdownString(content) {
  const frontmatter = {
    "doc_id": content.id,
    owner: content.owners[0].emailAddress,
    title: content.name,
    "created_date": content.createdTime,
    status: {
      ".tag": "active",
    },
    revision: content.version,
    "last_updated_date": content.modifiedTime,
    "last_editor": content.lastModifyingUser.emailAddress,
    "edit_link": content.webViewLink
  }
  const markdown = await processor.process(content.html)
  return `---
${JSON.stringify(frontmatter, null, 2)}
---
${String(markdown).replace(/https:\/\/lh.\.googleusercontent\.com\//g, '/content/')}
`
}
