import type { Theme } from 'vitepress'
import Layout from './Layout.vue'

import './design-system/tokens.css'
import './design-system/bundle.css'
import './styles/fonts.css'
import './styles/playbook.css'

export default {
  Layout,
} satisfies Theme
