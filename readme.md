# De Voorhoede Playbook
Playbook in the form of a website generated with [Vuepress](https://vuepress.vuejs.org/) and fetched [Dropbox Paper](https://www.dropbox.com/paper) documents.

## Development

### Quick start
#### Initial setup
```sh
git clone git@github.com:voorhoede/playbook.git
cd playbook
npm ci
```

#### Set environment
All needed environment variables are listed in the [.env.example](.env.example) file. To automatically set them fill in a `.env` file following the same structure as the example file.
```sh
cp .env.example .env
```

### Running
#### Development
Fetch content and start local server to preview the website.
```sh
npm start
```

#### Production
```sh
npm run docs:content
npm run docs:build
```

### Codebase overview
#### Structure
- `src` contains the logic needed to fetch & transform content before building.
- `docs/.vuepress` contains Vuepress configuration and front-end assets.

Because Vuepress does not support asynchronous configuration the fetching content and building the website is seperated. Which means the needed sidebar data is written to a temporary file so it can be synchronously read from [docs/.vuepress/config.js](docs/.vuepress/config.js).

#### Testing
Unit tests are present in [src/test.js](src/test.js) and are ran with: `npm test`.

#### Style
The code is written in a functional style using [Sanctuary](https://sanctuary.js.org/) to provide simple, pure functions with no need for `null` checks.
