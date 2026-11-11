import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

export interface OutlineItem {
  id: string
  title: string
}

/**
 * The h2 sections of the page content, the one in view and how far the reader is,
 * for the TocSection.
 */
export function useOutline(selector = '.playbook-content') {
  const route = useRoute()
  const items = ref<OutlineItem[]>([])
  const currentId = ref<string | null>(null)
  const progress = ref(0)
  let frame = 0

  function collect() {
    const root = document.querySelector(selector)
    items.value = root
      ? [...root.querySelectorAll<HTMLElement>('h2[id]')].map(heading => {
        const copy = heading.cloneNode(true) as HTMLElement
        copy.querySelectorAll('.header-anchor').forEach(anchor => anchor.remove())
        return { id: heading.id, title: (copy.textContent ?? '').trim() }
      })
      : []
    update()
  }

  function update() {
    frame = 0
    const root = document.querySelector<HTMLElement>(selector)
    if (!root) return
    const offset = 120
    let current: string | null = items.value[0]?.id ?? null
    for (const item of items.value) {
      const heading = document.getElementById(item.id)
      if (heading && heading.getBoundingClientRect().top - offset <= 0) current = item.id
    }
    currentId.value = current
    const { top, height } = root.getBoundingClientRect()
    const total = height - window.innerHeight
    progress.value = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 1
  }

  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

  onMounted(() => {
    collect()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(frame)
  })
  watch(() => route.path, () => nextTick(collect))

  return { items, currentId, progress }
}
