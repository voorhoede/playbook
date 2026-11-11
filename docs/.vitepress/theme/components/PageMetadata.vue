<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import CalloutBlock from './CalloutBlock.vue'

const props = defineProps<{
  id?: string
  date?: string
  editLink?: string
}>()

const formatDate = (date: string) => new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(date))

const lastUpdate = computed(() => props.date?.split('T')[0])
const lastVisit = ref<string | null>(null)
const today = () => new Date().toISOString().split('T')[0]

const storage = {
  get: (key: string) => { try { return localStorage.getItem(key) } catch { return null } },
  set: (key: string, value: string) => { try { localStorage.setItem(key, value) } catch { /* private mode */ } },
}

function registerVisit() {
  if (!props.id) return
  const key = `last-visit-${props.id}`
  lastVisit.value = storage.get(key)
  storage.set(key, today())
}

onMounted(registerVisit)
watch(() => props.id, registerVisit)

const updatedSinceLastVisit = computed(() =>
  Boolean(lastVisit.value && lastUpdate.value && new Date(lastVisit.value) < new Date(lastUpdate.value)),
)
</script>

<template>
  <div v-if="lastUpdate || editLink" class="page-metadata">
    <p class="page-metadata__line small">
      <span v-if="lastUpdate">Updated <time :datetime="lastUpdate">{{ formatDate(lastUpdate) }}</time></span>
      <a v-if="editLink" class="page-metadata__edit" :href="editLink" target="_blank" rel="noreferrer noopener">
        Edit in Google Drive<span class="sr-only"> (opens in a new tab)</span>
        <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M26 28H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10v2H6v20h20V16h2v10a2 2 0 0 1-2 2z" />
          <path fill="currentColor" d="M20 2v2h6.586L18 12.586 19.414 14 28 5.414V12h2V2H20z" />
        </svg>
      </a>
    </p>
    <CalloutBlock v-if="updatedSinceLastVisit" title="Updated since your last visit">
      <p>You last read this page on {{ formatDate(lastVisit!) }}. It was updated on {{ formatDate(lastUpdate!) }}.</p>
    </CalloutBlock>
  </div>
</template>

<style>
.page-metadata {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-20);
  margin-bottom: var(--spacing-40);
}

.page-metadata__line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-5) var(--spacing-20);
  margin: 0;
}

.page-metadata__edit {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-5);
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.page-metadata__edit:hover {
  text-decoration-thickness: 2px;
}
</style>
