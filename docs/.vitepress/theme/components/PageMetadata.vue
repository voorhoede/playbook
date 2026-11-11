<script setup lang="ts">
/**
 * When the page was last updated, a link to its Google Doc and, when the page changed since
 * this browser last showed it, a Callout that says so.
 */
import { computed, ref, watch, onMounted } from 'vue'
import AppButton from './AppButton.vue'
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

/* Read the previous visit of this page, then record this one. */
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
  <div class="page-metadata">
    <CalloutBlock v-if="updatedSinceLastVisit" title="Updated since your last visit">
      <p>You last read this page on {{ formatDate(lastVisit!) }}. It was updated on {{ formatDate(lastUpdate!) }}.</p>
    </CalloutBlock>
    <div v-if="lastUpdate || editLink" class="page-metadata__row">
      <p v-if="lastUpdate" class="small">
        Last updated on <time :datetime="lastUpdate">{{ formatDate(lastUpdate) }}</time>
      </p>
      <AppButton v-if="editLink" label="Edit on Google Drive" :to="editLink" secondary external />
    </div>
  </div>
</template>
