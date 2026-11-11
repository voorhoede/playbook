# De Voorhoede Playbook
[![Netlify Status][netlify-icon]][netlify]

Company playbook containing internal information about common questions & situations at De Voorhoede in the form of a website generated with [VitePress](https://vitepress.dev/) and fetched [Google Drive](https://drive.google.com) documents. It is styled according to the De Voorhoede styles.

## Development

### Quick start
#### Initial setup
```sh
git clone git@github.com:voorhoede/playbook.git
cd playbook
pnpm ci
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
pnpm run dev
```

#### Theme only
Once the content has been fetched (`docs/**/*.md` and `playbookFolders.json` exist), work on the theme without fetching again:
```sh
pnpm run dev:theme
```

#### Production
Fetch content and generate static website files.
```sh
env NODE_ENV=production pnpm run build
```

## Design
The theme lives in [`docs/.vitepress/theme`](docs/.vitepress/theme) and is built from the De Voorhoede design system:

- `design-system/tokens.css` holds the De Voorhoede tokens (colours, spacing, fonts). Don't edit it by hand; to update it, copy in the new version.
- `components/` holds the Vue components. Each one carries its own styles, with class names that match the component (`AppHeader` uses `.app-header`).
- `styles/playbook.css` holds the few global styles: the reset, the type styles and the page container.

The playbook serves the full Apercu font files from `docs/public/fonts`. The design system's fonts are Basic Latin subsets, which miss the Dutch diacritics.

[netlify]: https://app.netlify.com/sites/voorhoede-playbook/deploys
[netlify-icon]: https://api.netlify.com/api/v1/badges/6cb9ad83-2aee-4233-9ed3-62d0fa799b9f/deploy-status
