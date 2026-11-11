import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

export interface OutlineItem {
  id: string
  title: string
}

export function useOutline(selector = '.layout__content') {
  const route = useRoute()
  const items = ref<OutlineItem[]>([])
  const currentId = ref<string | null>(null)
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
    // More than scrollOffset in config.mts, so a heading jumped to counts as the current one.
    const offset = 120
    let current: string | null = items.value[0]?.id ?? null
    for (const item of items.value) {
      const heading = document.getElementById(item.id)
      if (heading && heading.getBoundingClientRect().top - offset <= 0) current = item.id
    }
    currentId.value = current
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

  return { items, currentId }
}
