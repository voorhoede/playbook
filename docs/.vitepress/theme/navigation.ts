import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

/** '/a/b.html', '/a/b' and '/a/b/' all name the same page. */
export const normalizePath = (path: string) => decodeURI(path)
  .replace(/[?#].*$/, '')
  .replace(/(index)?\.html$/, '')
  .replace(/\/$/, '') || '/'

export const flatten = (items: SidebarItem[]): SidebarItem[] =>
  items.flatMap(item => item.items ? flatten(item.items) : [item])

export const firstLink = (item: SidebarItem): string | undefined =>
  item.link ?? (item.items ? flatten(item.items)[0]?.link : undefined)

export const containsPath = (item: SidebarItem, path: string): boolean =>
  item.link
    ? normalizePath(item.link) === path
    : (item.items ?? []).some(child => containsPath(child, path))

export function useNavigation() {
  const { theme } = useData()
  const route = useRoute()

  const sidebar = computed<SidebarItem[]>(() => theme.value.sidebar ?? [])
  const pages = computed(() => flatten(sidebar.value).filter(item => item.link))
  const currentPath = computed(() => normalizePath(route.path))
  const currentIndex = computed(() => pages.value.findIndex(page => normalizePath(page.link!) === currentPath.value))
  const previous = computed(() => currentIndex.value > 0 ? pages.value[currentIndex.value - 1] : null)
  const next = computed(() => currentIndex.value > -1 ? pages.value[currentIndex.value + 1] ?? null : null)

  return { sidebar, pages, currentPath, previous, next }
}
