<script setup lang="ts">
/** The design system's HomeHero: the full-screen header of the home page. */
import { withBase } from 'vitepress'
import SelfTypingText from './SelfTypingText.vue'

defineProps<{
  title: string
  intro: string
  illustration?: string
}>()

const curlyBracket = `url("${withBase('/images/curly-bracket--paper-rotated.svg')}")`
</script>

<template>
  <header
    class="page-header grid page-header--curly-bracket page-header--fill-screen"
    :class="illustration && 'page-header--has-image'"
    :style="{ '--page-header-curly-bracket': curlyBracket }"
  >
    <span class="page-header__background" />
    <div class="page-header__text">
      <p class="h3 font-normal">{{ title }}</p>
      <h1 class="sr-only">{{ intro }}</h1>
      <SelfTypingText class="h1" :text="intro" />
    </div>
    <div v-if="illustration" class="page-header__image-column">
      <div class="page-header__image-column-content">
        <img class="page-header__image" :src="withBase(illustration)" alt="" loading="eager">
      </div>
    </div>
    <div class="scroll-to">
      <div class="scroll-to__point-down">
        <img class="scroll-to__image" :src="withBase('/images/scroll-to-arrow--down.svg')" alt="">
      </div>
    </div>
  </header>
</template>
