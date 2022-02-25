const fs = require('fs');
const {google} = require('googleapis');
const {config} = require('dotenv-safe');
config();
const {GOOGLE_PLAYBOOK_FOLDER_NAME} = process.env;
const showdown  = require('showdown');
const converter = new showdown.Converter();
const jsdom = require("jsdom");

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  if (fs.existsSync('documents')) {
    fs.rmSync('documents', { recursive: true, force: true });
  }
  authorize(JSON.parse(content), findPlaybookFolders);
});

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
 * Read the playbook folder json or fetch it from drive
 * @param {google.auth.JWT} auth An authorized OAuth2 client.
 */
function findPlaybookFolders(auth) {
  const drive = google.drive('v3');
  fs.readFile('playbookFolders.json', async (err, pathsBuffer) => {
    if (err) {
      return getPlaybookFolderFromDrive(drive, auth);
    } else {
      const paths = JSON.parse(pathsBuffer);
      const files = await listFilesAndFolders(drive, auth, paths);
      const contents = await getFileContents(drive, auth, files);
      ensureDirectoryExistence('./documents')
      Promise.all(contents.map(content => {
        const html = cleanHtml(content.html)
        const dom = new jsdom.JSDOM()
        ensureDirectoryExistence(`./documents${content.folderName}`)
        return fs.promises.writeFile(
          `./documents${content.folderName}/${content.name.replaceAll(' ', '-').replaceAll('.', '').toLowerCase()}.md`,
          converter.makeMarkdown(html, dom.window.document))
      }))
    }
  })
}

/**
 *
 * @param htmlString
 * @returns {*|string}
 */
function cleanHtml(htmlString) {
  const html = new jsdom.JSDOM(htmlString)
  const styleTag = html.window.document.querySelector('style')
  const spans = html.window.document.getElementsByTagName('span');

  while(spans.length) {
    const parent = spans[ 0 ].parentNode;
    while( spans[ 0 ].firstChild ) {
      parent.insertBefore(  spans[ 0 ].firstChild, spans[ 0 ] );
    }
    parent.removeChild( spans[ 0 ] );
  }
  if(styleTag) {
    styleTag.remove()
  }
  return html.serialize()
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
          ? folderName.replaceAll(' ', '-')
          : ''}/${d.name.replaceAll(' ', '-')}`)
      : [])]
  }).flat()
  const documents = flattenFilesObject(files).filter(file => file.mimeType === 'application/vnd.google-apps.document')
  console.log(documents);
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
  return await fs.promises.writeFile('playbookFolders.json', JSON.stringify({root: paths.root, files: allFiles})).then (err => {
    if (err) return console.error(err);
    console.log('written files to playbookFolders.json');
    return allFiles
  })
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
    q: `'${folderId}' in parents`, spaces: 'drive', pageSize: 10,
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
      fs.writeFile('playbookFolders.json', JSON.stringify({root}), (err) => {
        if (err) return console.error(err);
        console.log('root stored to playbookFolders.json');
        findPlaybookFolders(auth)
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
