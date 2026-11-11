<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { useRoute } from 'vitepress'
import { useOutline } from '../outline'

const props = withDefaults(defineProps<{
  variant?: 'side' | 'bar'
}>(), { variant: 'side' })

const { items, currentId } = useOutline()
const open = ref(false)
const toggle = ref<HTMLButtonElement>()
const panelId = useId()
const route = useRoute()

const current = computed(() => items.value.find(item => item.id === currentId.value) ?? items.value[0])
watch(() => route.path, () => { open.value = false })

function close() {
  if (!open.value) return
  open.value = false
  toggle.value?.focus()
}
</script>

<template>
  <template v-if="items.length > 1">
    <section v-if="props.variant === 'side'" class="toc-section">
      <p class="toc-section__title small font-bold" aria-hidden="true">On this page</p>
      <nav class="toc-section__nav small" aria-label="On this page">
        <ul class="toc-section__list">
          <li v-for="item in items" :key="item.id" class="toc-section__list-item">
            <a :href="`#${item.id}`" class="toc-section__link" :aria-current="item.id === currentId ? 'location' : undefined">
              <span>{{ item.title }}</span>
              <span class="toc-section__link-bold" aria-hidden="true">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </section>

    <div v-else class="toc-section__bar" @keydown.esc="close">
      <button
        ref="toggle"
        type="button"
        class="toc-section__toggle small"
        :aria-expanded="open"
        :aria-controls="panelId"
        @click="open = !open"
      >
        <span>Contents:</span>
        <span class="toc-section__current">{{ current?.title }}</span>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
      <nav :id="panelId" class="toc-section__panel small" aria-label="Contents" :hidden="!open">
        <ul class="toc-section__list">
          <li v-for="item in items" :key="item.id" class="toc-section__list-item">
            <a
              :href="`#${item.id}`"
              class="toc-section__link"
              :aria-current="item.id === currentId ? 'location' : undefined"
              @click="open = false"
            >
              <span>{{ item.title }}</span>
              <span class="toc-section__link-bold" aria-hidden="true">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
</template>

<style>
/* side: a sticky list in the column beside the text, from 720px. */
.toc-section {
  display: none;
}

@media (min-width: 720px) {
  /* A long list scrolls inside the group, so its end stays reachable. */
  .toc-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-20);
    position: sticky;
    z-index: var(--z-index-sticky);
    top: var(--spacing-40);
    max-height: calc(100vh - var(--spacing-80));
  }

  .toc-section__nav {
    min-height: 0;
    overflow-y: auto;
  }
}

.toc-section__title {
  padding-inline: var(--spacing-20);
}

.toc-section__list {
  display: flex;
  flex-direction: column;
}

/* Room around the text, so the highlight of the current section reads as a block. The list
   scrolls (overflow), so the room is padding inside the column, not a negative margin. */
.toc-section__link {
  display: grid;
  padding: var(--spacing-10) var(--spacing-20);
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* The text is there twice in one grid cell: the bold copy is hidden but takes its room, so a
   link that becomes current (bold) never rewraps and pushes the list down. */
.toc-section__link > span {
  grid-area: 1 / 1;
}

.toc-section__link-bold {
  font-weight: 700;
  visibility: hidden;
}

.toc-section__link[aria-current="location"] {
  background-color: var(--gray-light);
  font-weight: 700;
}

/* bar: a sticky "Contents: <section>" bar that opens the list, for narrow screens. */
.toc-section__bar {
  position: sticky;
  z-index: var(--z-index-sticky);
  top: 0;
  background-color: var(--gray-light);
}

.toc-section__toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-10);
  width: 100%;
  min-height: 52px;
  padding: var(--spacing-10) var(--grid-margin);
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.toc-section__current {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--blue);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-section__toggle svg {
  flex: none;
  color: var(--blue);
}

.toc-section__toggle[aria-expanded="true"] svg {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: no-preference) {
  .toc-section__toggle svg {
    transition: transform .2s ease-out;
  }
}

.toc-section__panel {
  position: absolute;
  z-index: var(--z-index-overlay);
  top: 100%;
  right: 0;
  left: 0;
  max-height: 60vh;
  overflow-y: auto;
  padding: var(--spacing-20) var(--grid-margin);
  background-color: var(--white);
  box-shadow: var(--box-shadow);
}

.toc-section__panel[hidden] {
  display: none;
}
</style>
