<script setup lang="ts">
/** The navigation column beside the text, from 800px, on a gray-light ground. */
import SidebarTree from './SidebarTree.vue'
import { useNavigation } from '../navigation'

const { sidebar, currentPath } = useNavigation()
</script>

<template>
  <nav class="playbook-sidebar small" aria-label="Playbook">
    <SidebarTree :items="sidebar" :current-path="currentPath" />
  </nav>
</template>
