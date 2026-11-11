<script setup lang="ts">
/** A YouTube video or playlist in the design system's FixedRatio box (16:9). */
import { computed } from 'vue'

const props = defineProps<{
  id: string
  type: 'singleVideo' | 'playlist'
  title?: string
}>()

/* A bare URL as link text makes a poor accessible name. */
const name = computed(() => props.title && !/^https?:\/\//.test(props.title) ? props.title : 'YouTube video')

const src = computed(() => props.type === 'playlist'
  ? `https://www.youtube-nocookie.com/embed/videoseries?list=${props.id}`
  : `https://www.youtube-nocookie.com/embed/${props.id}`)
</script>

<template>
  <figure class="youtube-embed">
    <div class="fixed-ratio" style="padding-top: 56.25%">
      <iframe
        class="fixed-ratio__content"
        :src="src"
        :title="name"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen
      />
    </div>
  </figure>
</template>
