<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import MiniSearch from 'minisearch'
import localSearchIndex from '@localSearchIndex'
import { normalizePath, useNavigation } from '../navigation'

interface Result { id: string, title?: string, titles?: string[] }

const props = defineProps<{
  /* Focus this field with the / key. */
  shortcut?: boolean
}>()
const label = 'Search the playbook'

const input = ref<HTMLInputElement>()

function onShortcut(event: KeyboardEvent) {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return
  const target = event.target as HTMLElement
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return
  if (!input.value?.offsetParent) return
  event.preventDefault()
  input.value.focus()
}

onMounted(() => { if (props.shortcut) window.addEventListener('keydown', onShortcut) })
onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut))

const router = useRouter()
const { pages } = useNavigation()
const query = ref('')
const open = ref(false)
const active = ref(0)
const listId = useId()
const index = shallowRef<MiniSearch<Result> | null>(null)

async function loadIndex() {
  if (index.value) return
  const data = await localSearchIndex.root?.()
  if (!data) return
  index.value = markRaw(MiniSearch.loadJSON<Result>(data.default, {
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles'],
    searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
  }))
}

const pageTitle = (id: string) => {
  const path = normalizePath(id)
  return pages.value.find(page => normalizePath(page.link!) === path)?.text
}

const results = computed(() => {
  if (!index.value || query.value.trim().length < 2) return []
  return (index.value.search(query.value.trim()) as unknown as Result[]).slice(0, 8).map(result => {
    const page = pageTitle(result.id)
    const trail = [page, ...(result.titles ?? [])].filter(Boolean) as string[]
    return {
      href: withBase(result.id),
      title: result.title || page || result.id,
      trail: result.title ? trail : trail.slice(1),
    }
  })
})

watch(query, () => {
  active.value = 0
  open.value = true
})

function go(href: string) {
  open.value = false
  query.value = ''
  router.go(href)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
  } else if (event.key === 'ArrowDown' && results.value.length) {
    event.preventDefault()
    active.value = (active.value + 1) % results.value.length
  } else if (event.key === 'ArrowUp' && results.value.length) {
    event.preventDefault()
    active.value = (active.value - 1 + results.value.length) % results.value.length
  } else if (event.key === 'Enter' && results.value[active.value]) {
    event.preventDefault()
    go(results.value[active.value].href)
  }
}

const showPanel = computed(() => open.value && query.value.trim().length >= 2)

/* Announced to screen readers while typing: how many results there are. */
const status = computed(() => {
  if (!showPanel.value || !index.value) return ''
  const count = results.value.length
  return count ? `${count} ${count === 1 ? 'result' : 'results'}, use the arrow keys to choose` : 'No pages found'
})
</script>

<template>
  <div class="search-box" @focusout="(event: FocusEvent) => { if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) open = false }">
    <label class="search-box__label">
      <span class="sr-only">{{ label }}</span>
      <svg class="search-box__icon" viewBox="0 0 32 32" width="20" height="20" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29zM4 13a9 9 0 1 1 9 9 9.01 9.01 0 0 1-9-9z" />
      </svg>
      <input
        ref="input"
        v-model="query"
        class="search-box__input body"
        type="search"
        :placeholder="label"
        autocomplete="off"
        role="combobox"
        :aria-expanded="showPanel"
        :aria-controls="listId"
        :aria-activedescendant="showPanel && results.length ? `${listId}-${active}` : undefined"
        @focus="loadIndex(); open = true"
        @keydown="onKeydown"
      >
      <kbd v-if="shortcut && !query" class="search-box__shortcut small" aria-hidden="true">/</kbd>
    </label>
    <div v-show="showPanel" class="search-box__panel">
      <ul :id="listId" class="search-box__results" role="listbox" :aria-label="label">
        <li
          v-for="(result, i) in results"
          :id="`${listId}-${i}`"
          :key="result.href"
          role="option"
          :aria-selected="i === active"
          :class="['search-box__result', i === active && 'search-box__result--active']"
          @mousedown.prevent
          @click="go(result.href)"
        >
          <span class="search-box__result-title body">{{ result.title }}</span>
          <span v-if="result.trail.length" class="search-box__result-trail small">{{ result.trail.join(' › ') }}</span>
        </li>
      </ul>
      <p v-if="!results.length" class="search-box__empty small">No pages found for “{{ query.trim() }}”.</p>
    </div>
    <p class="sr-only" role="status">{{ status }}</p>
  </div>
</template>

<style>
.search-box {
  position: relative;
}

.search-box__label {
  position: relative;
  display: block;
}

.search-box__icon {
  position: absolute;
  top: 50%;
  left: var(--spacing-15);
  color: var(--blue);
  transform: translateY(-50%);
  pointer-events: none;
}

.search-box__input {
  min-height: 44px;
  margin-top: 0;
  padding: var(--spacing-5) var(--spacing-40) var(--spacing-5) calc(var(--spacing-15) + 20px + var(--spacing-10));
  /* Apercu sits high in its line box: nudge the text down so it looks centred in the field. */
  padding-top: calc(var(--spacing-5) + .15em);
  padding-bottom: calc(var(--spacing-5) - .15em);
  line-height: 1.5;
  background-color: var(--white);
}

.search-box__input::placeholder {
  color: var(--black);
}

.search-box__input::-webkit-search-cancel-button {
  cursor: pointer;
}

.search-box__shortcut {
  position: absolute;
  top: 50%;
  right: var(--spacing-10);
  min-width: 1.5rem;
  padding: 0 var(--spacing-5);
  background-color: var(--gray-light);
  color: var(--black);
  font-family: var(--font-code);
  line-height: 1.5rem;
  text-align: center;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-box__input:focus ~ .search-box__shortcut {
  display: none;
}

.search-box__panel {
  position: absolute;
  z-index: var(--z-index-overlay);
  top: calc(100% + var(--spacing-5));
  right: 0;
  left: 0;
  max-height: 70vh;
  overflow-y: auto;
  padding: var(--spacing-10) 0;
  background-color: var(--white);
  box-shadow: var(--box-shadow);
}

.search-box__result {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-10) var(--spacing-20);
  cursor: pointer;
}

.search-box__result-title {
  color: var(--blue);
  font-weight: 700;
}

.search-box__result--active,
.search-box__result:hover {
  background-color: var(--blue-light);
}

.search-box__result--active .search-box__result-title,
.search-box__result:hover .search-box__result-title {
  text-decoration: underline;
}

.search-box__empty {
  padding: var(--spacing-10) var(--spacing-20);
}
</style>
