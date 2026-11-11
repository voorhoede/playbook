<script setup lang="ts">
/** The design system's AppButton: a link with `to`, a button without. */
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  label: string
  to?: string
  secondary?: boolean
  small?: boolean
  external?: boolean
}>()

const primary = computed(() => !props.secondary && !props.small)
const classes = computed(() => [
  'app-button',
  !props.small && 'body',
  primary.value && 'app-button--primary font-bold',
  props.secondary && 'app-button--secondary',
  props.small && 'app-button--small small font-bold',
])
const href = computed(() => props.to && !props.external ? withBase(props.to) : props.to)
</script>

<template>
  <a
    v-if="to"
    :class="classes"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer noopener' : undefined"
  >
    <span v-if="primary || small">{{ label }}</span>
    <template v-else>{{ label }} →</template>
    <span v-if="external" class="sr-only"> (opens in a new tab)</span>
  </a>
  <button v-else :class="classes">
    <span v-if="primary || small">{{ label }}</span>
    <template v-else>{{ label }} →</template>
  </button>
</template>
