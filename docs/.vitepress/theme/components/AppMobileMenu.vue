<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import SearchBox from './SearchBox.vue'
import SidebarTree from './SidebarTree.vue'
import { useNavigation } from '../navigation'

const { sidebar, currentPath } = useNavigation()
const route = useRoute()
const open = ref(false)
const button = ref<HTMLButtonElement>()

watch(open, value => {
  document.documentElement.classList.toggle('scroll-lock', value)
  // The menu covers the page: keep keyboard and screen reader focus out of what lies behind it.
  document.querySelectorAll<HTMLElement>('.layout > :not(.app-mobile-menu)').forEach(element => {
    element.inert = value
  })
})

watch(() => route.path, () => { open.value = false })

// From 800px the menu is hidden, so it has to close or the page stays inert.
const wide = typeof window === 'undefined' ? null : window.matchMedia('(min-width: 800px)')
const closeWhenWide = () => { if (wide?.matches) open.value = false }
onMounted(() => wide?.addEventListener('change', closeWhenWide))
onBeforeUnmount(() => wide?.removeEventListener('change', closeWhenWide))

function toggleMenu() {
  open.value = !open.value
  button.value?.focus()
}
</script>

<template>
  <div class="app-mobile-menu" @keydown.esc="open && toggleMenu()">
    <button
      ref="button"
      type="button"
      :class="['app-mobile-menu__button', open ? 'app-mobile-menu__button--close' : 'app-mobile-menu__button--open']"
      :aria-expanded="open"
      aria-controls="app-mobile-menu-content"
      @click="toggleMenu"
    >
      <span :class="['app-mobile-menu__button-icon', open ? 'app-mobile-menu__button-icon--close' : 'app-mobile-menu__button-icon--open']" />
      <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
    </button>
    <div v-show="open" id="app-mobile-menu-content" class="app-mobile-menu__content">
      <nav class="app-mobile-menu__nav" aria-label="Playbook">
        <a :href="withBase('/')" class="app-mobile-menu__home">
          <img class="app-mobile-menu__logo" :src="withBase('/images/voorhoede-logo.svg')" alt="">
          <span class="h3">Playbook</span>
        </a>
        <SearchBox />
        <SidebarTree :items="sidebar" :current-path="currentPath" />
      </nav>
    </div>
  </div>
</template>

<style>
.app-mobile-menu {
  --app-mobile-menu-offset: 20px;
  --app-mobile-menu-button-size: 52px;
  position: relative;
  z-index: var(--z-index-overlay);
}

@media (min-width: 800px) {
  .app-mobile-menu {
    display: none;
  }
}

.app-mobile-menu__button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: var(--app-mobile-menu-offset);
  right: var(--app-mobile-menu-offset);
  z-index: var(--z-index-raised);
  width: var(--app-mobile-menu-button-size);
  height: var(--app-mobile-menu-button-size);
  border: none;
  background-color: var(--blue);
  box-shadow: var(--box-shadow);
  cursor: pointer;
}

.app-mobile-menu__button:focus,
.app-mobile-menu__button:active {
  background: var(--white);
}

.app-mobile-menu__button-icon {
  width: 25px;
  height: 25px;
}

.app-mobile-menu__button-icon--open {
  background-image: url('/images/icon_menu-passive--white.svg');
}

.app-mobile-menu__button-icon--close {
  background-image: url('/images/icon_menu-exit--white.svg');
}

.app-mobile-menu__button:is(:focus, :active) .app-mobile-menu__button-icon--open {
  background-image: url('/images/icon_menu-passive--blue.svg');
}

.app-mobile-menu__button:is(:focus, :active) .app-mobile-menu__button-icon--close {
  background-image: url('/images/icon_menu-exit--blue.svg');
}

.app-mobile-menu__content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding: 12px 20px calc(var(--app-mobile-menu-button-size) + 2 * var(--app-mobile-menu-offset));
  background-color: var(--yellow);
  box-shadow: rgba(0, 0, 0, .3) 0 0 3px 1px;
}

.app-mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-30);
  font-size: 1.125rem;
}

.app-mobile-menu__home {
  display: flex;
  align-items: center;
  gap: var(--spacing-15);
  color: var(--blue);
}

.app-mobile-menu__logo {
  width: auto;
  height: 1.4375rem;
}

.app-mobile-menu__nav .sidebar-tree__link--current {
  background-color: var(--yellow-light);
}

/* Set on <html> while the menu is open. */
.scroll-lock {
  overflow: hidden;
}
</style>
