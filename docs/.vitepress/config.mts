import { defineConfig } from 'vitepress'
import { generateSidebar, getMetaData } from '../../scripts/google-drive/main.mjs'
import { codeBlock, liftTitle } from './markdown.mts'



export default async () => {
  const documentsMetaData = await getMetaData()

  return defineConfig({
    title: 'Playbook',
    description: 'How we like to work and play at De Voorhoede.',
    lang: 'en',
    outDir: '../dist',
    // Keep the .html URLs of the VuePress site, so existing links keep working.
    cleanUrls: false,
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: '32x32' }],
      ['link', { rel: 'icon', href: '/images/voorhoede-favicon.png', type: 'image/png' }],
      ['link', { rel: 'apple-touch-icon', href: '/images/voorhoede-apple-touch-icon.png' }],
      ['link', { rel: 'preload', href: '/fonts/apercu-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
      ['link', { rel: 'preload', href: '/fonts/apercu-bold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
    ],
    themeConfig: {
      sidebar: generateSidebar(documentsMetaData),
      search: { provider: 'local' },
    },
    markdown: {
      anchor: { level: [2, 3] },
      config(md) {
        liftTitle(md)
        codeBlock(md)
      },
    },
  })
}
