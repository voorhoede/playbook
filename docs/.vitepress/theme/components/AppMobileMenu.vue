<script setup lang="ts">
/**
 * The design system's AppMobileMenu: a square blue button bottom right that opens a full-screen
 * yellow menu. Below 800px it holds the search and the playbook's navigation tree.
 */
import { ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import SearchBox from './SearchBox.vue'
import SidebarTree from './SidebarTree.vue'
import { useNavigation } from '../navigation'

const { sidebar, currentPath } = useNavigation()
const route = useRoute()
const open = ref(false)
const state = ref<'enter' | 'leave' | null>(null)
const visible = ref(false)
const button = ref<HTMLButtonElement>()

watch(open, value => {
  if (value) { visible.value = true; state.value = 'enter' }
  else if (visible.value) state.value = 'leave'
  document.documentElement.classList.toggle('scroll-lock', value)
  // The menu covers the page: keep keyboard and screen reader focus out of what lies behind it.
  document.querySelectorAll<HTMLElement>('.playbook > :not(.app-mobile-menu)').forEach(element => {
    element.inert = value
  })
})

watch(() => route.path, () => { open.value = false })

function onAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget) return
  if (state.value === 'leave') visible.value = false
  state.value = null
}

function toggleMenu() {
  open.value = !open.value
  button.value?.focus()
}
</script>

<template>
  <div class="app-mobile-menu grid" @keydown.esc="open && toggleMenu()">
    <button
      ref="button"
      type="button"
      :class="['app-mobile-menu__button', open ? 'app-mobile-menu__button--close' : 'app-mobile-menu__button--open']"
      :aria-expanded="open"
      aria-controls="app-mobile-menu-content"
      @click="toggleMenu"
    >
      <div :class="['app-mobile-menu__button-icon', open ? 'app-mobile-menu__button-icon--close' : 'app-mobile-menu__button-icon--open']" />
      <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
    </button>
    <div
      v-show="visible"
      id="app-mobile-menu-content"
      :class="[
        'app-mobile-menu__content',
        state === 'enter' && 'app-mobile-menu-slidein-enter-active',
        state === 'leave' && 'app-mobile-menu-slidein-leave-active',
      ]"
      @animationend="onAnimationEnd"
    >
      <nav class="playbook-mobile-menu__nav" aria-label="Playbook">
        <a :href="withBase('/')" class="playbook-mobile-menu__home">
          <img class="app-mobile-menu__logo" :src="withBase('/images/voorhoede-logo.svg')" alt="">
          <span class="h3">Playbook</span>
        </a>
        <SearchBox class="playbook-mobile-menu__search" />
        <SidebarTree :items="sidebar" :current-path="currentPath" />
      </nav>
    </div>
  </div>
</template>
