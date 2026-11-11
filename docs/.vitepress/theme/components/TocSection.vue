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
        <ul class="flat-list toc-section__list">
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
        <ul class="flat-list toc-section__list">
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
.toc-section__title {
  margin: 0;
  padding-inline: var(--spacing-20);
}

.toc-section .toc-section__list,
.toc-section__panel .toc-section__list {
  gap: 0;
}

/* Room around the text, so the highlight of the current section reads as a block. The list
   scrolls (overflow), so the room is padding inside the column, not a negative margin. */
.toc-section__link {
  margin-inline: 0;
  padding: var(--spacing-10) var(--spacing-20);
  text-underline-offset: 4px;
}
</style>
