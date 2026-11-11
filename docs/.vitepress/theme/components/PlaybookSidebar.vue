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
