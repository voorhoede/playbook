<script setup lang="ts">
import SidebarTree from './SidebarTree.vue'
import { useNavigation } from '../navigation'

const { sidebar, currentPath } = useNavigation()
</script>

<template>
  <nav class="playbook-sidebar small" aria-label="Playbook">
    <SidebarTree :items="sidebar" :current-path="currentPath" />
  </nav>
</template>

<style>
.playbook-sidebar {
  position: relative;
  padding: var(--spacing-40) var(--spacing-20) var(--block-spacing) 0;
  background-color: var(--gray-light);
}

/* The ground continues to the left edge of the window, past the container. */
.playbook-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  width: 100vw;
  background-color: var(--gray-light);
}

.playbook-sidebar > .sidebar-tree {
  position: sticky;
  top: var(--spacing-20);
  max-height: calc(100vh - var(--spacing-40));
  overflow-y: auto;
  /* room for the highlight and focus outline of the links inside the scroll area */
  margin-left: calc(-1 * var(--spacing-15));
  padding-left: var(--spacing-15);
  padding-block: var(--spacing-5);
}

@media (min-width: 1100px) {
  .playbook-sidebar {
    padding-top: var(--spacing-60);
  }
}
</style>
