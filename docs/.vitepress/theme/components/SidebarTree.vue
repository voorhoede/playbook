<script setup lang="ts">
/**
 * The playbook's navigation tree. A folder is a toggle that opens its pages; the folder that
 * holds the current page is open, and the current page is bold with aria-current.
 */
import { ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { containsPath, normalizePath, type SidebarItem } from '../navigation'

const props = defineProps<{
  items: SidebarItem[]
  currentPath: string
  level?: number
}>()

const depth = props.level ?? 1
const isCurrent = (item: SidebarItem) => Boolean(item.link) && normalizePath(item.link!) === props.currentPath
const opened = ref(new Set<string>())

watch(() => props.currentPath, path => {
  props.items.forEach(item => { if (item.items && containsPath(item, path)) opened.value.add(item.text) })
}, { immediate: true })

function toggle(item: SidebarItem) {
  const next = new Set(opened.value)
  next.has(item.text) ? next.delete(item.text) : next.add(item.text)
  opened.value = next
}
</script>

<template>
  <ul :class="['sidebar-tree', `sidebar-tree--level-${depth}`]">
    <li v-for="item in items" :key="item.text" class="sidebar-tree__item">
      <template v-if="item.items">
        <button
          type="button"
          class="sidebar-tree__toggle font-bold"
          :aria-expanded="opened.has(item.text)"
          @click="toggle(item)"
        >
          <svg class="sidebar-tree__chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
          {{ item.text }}
        </button>
        <SidebarTree v-show="opened.has(item.text)" :items="item.items" :current-path="currentPath" :level="depth + 1" />
      </template>
      <a
        v-else
        :class="['sidebar-tree__link', isCurrent(item) && 'sidebar-tree__link--current']"
        :href="withBase(item.link!)"
        :aria-current="isCurrent(item) ? 'page' : undefined"
      >{{ item.text }}</a>
    </li>
  </ul>
</template>
