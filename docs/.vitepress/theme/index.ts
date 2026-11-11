import type { Theme } from 'vitepress'
import './design-system/tokens.css'
import './design-system/bundle.css'
import './styles/fonts.css'
import './styles/playbook.css'
import Layout from './Layout.vue'

export default {
  Layout,
} satisfies Theme
