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

- `design-system/` holds the system's tokens (`tokens.css`) and its stylesheet (`bundle.css`). Don't edit these files by hand; to update them, copy in the new versions.
- `components/` rebuilds the system's components in Vue, using the system's markup and class names. The system's own components are React, so they can't be used directly.
- `styles/playbook.css` lays out the docs pages and maps the Drive content onto the system's type and blocks, using tokens only.

The playbook serves the full Apercu font files from `docs/public/fonts`. The design system's fonts are Basic Latin subsets, which miss the Dutch diacritics.

[netlify]: https://app.netlify.com/sites/voorhoede-playbook/deploys
[netlify-icon]: https://api.netlify.com/api/v1/badges/6cb9ad83-2aee-4233-9ed3-62d0fa799b9f/deploy-status
