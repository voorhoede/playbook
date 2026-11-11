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

<style>
/* A label longer than its container wraps instead of making the page scroll sideways. */
.app-button {
  display: inline-block;
  max-width: 100%;
  text-align: center;
  line-height: 1.18;
  overflow-wrap: break-word;
}

.app-button--primary,
.app-button--small {
  position: relative;
  isolation: isolate;
  color: var(--white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-button--primary {
  padding: .85rem 1.5rem .7rem;
}

.app-button--small {
  padding: .375rem .9375rem;
}

.app-button > span {
  position: relative;
  z-index: var(--z-index-raised);
}

.app-button--primary::before,
.app-button--small::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: var(--z-index-base);
  background-color: var(--blue);
  border-radius: var(--border-radius);
  transition: transform .15s;
}

.app-button--primary:is(:hover, :focus, :active)::before,
.app-button--small:is(:hover, :focus)::before {
  transform: scale(1.05, 1.3);
}

.app-button--primary > span::after {
  content: '\2192';
  display: inline-block;
  margin-left: .3em;
  font-size: 1.2em;
  line-height: .5;
  vertical-align: middle;
  transition: transform .15s;
}

.app-button--primary:is(:hover, :focus) > span::after {
  transform: translateX(.5em);
}

.app-button--secondary {
  color: var(--blue);
}

.app-button--secondary:active {
  color: var(--blue-dark);
}

.app-button--secondary::after {
  content: '';
  display: block;
  height: 1px;
  background-color: var(--blue);
  transform-origin: 0% 50%;
  transition: transform .15s ease-in-out;
}

.app-button--secondary:is(:hover, :focus, :active)::after {
  transform: scaleX(0);
  transform-origin: 100% 50%;
}
</style>
