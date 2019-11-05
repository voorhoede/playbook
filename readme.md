# De Voorhoede Playbook
[![Netlify Status][netlify-icon]][netlify]

Company playbook containing internal information about common questions & situations at De Voorhoede in the form of a website generated with [Vuepress](https://vuepress.vuejs.org/) and fetched [Dropbox Paper](https://www.dropbox.com/paper) documents.

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

[netlify]: https://app.netlify.com/sites/voorhoede-playbook/deploys
[netlify-icon]: https://api.netlify.com/api/v1/badges/6cb9ad83-2aee-4233-9ed3-62d0fa799b9f/deploy-status
