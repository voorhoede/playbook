<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  label: string
  to: string
  secondary?: boolean
}>()
</script>

<template>
  <a
    :class="['app-button', 'body', secondary ? 'app-button--secondary' : 'app-button--primary font-bold']"
    :href="withBase(to)"
  >
    <template v-if="secondary">{{ label }} →</template>
    <span v-else>{{ label }}</span>
  </a>
</template>
