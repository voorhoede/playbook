<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import AppHeader from './components/AppHeader.vue'
import AppMobileMenu from './components/AppMobileMenu.vue'
import AppFooter from './components/AppFooter.vue'
import HeroHeader from './components/HeroHeader.vue'
import ContentCard from './components/ContentCard.vue'
import AppButton from './components/AppButton.vue'
import PlaybookSidebar from './components/PlaybookSidebar.vue'
import PageMetadata from './components/PageMetadata.vue'
import TocSection from './components/TocSection.vue'
import BreadcrumbsBlock from './components/BreadcrumbsBlock.vue'
import { firstLink, flatten, useNavigation } from './navigation'

const { page, frontmatter } = useData()
const { sidebar, pages, previous, next } = useNavigation()

/* "Start reading" opens the first page of the playbook, so the link can't go stale. */
const firstPage = computed(() => pages.value[0]?.link)

const isHome = computed(() => frontmatter.value.layout === 'home')
const isNotFound = computed(() => page.value.isNotFound)

/* The router only scrolls to a #hash; the skip link also has to move keyboard focus. */
const skipTarget = computed(() => isHome.value || isNotFound.value ? 'main' : 'content')
function skipToContent() {
  const target = document.getElementById(skipTarget.value)
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  target.scrollIntoView()
}

const sections = computed(() => sidebar.value.map(item => {
  const pages = item.items ? flatten(item.items) : []
  // Drive file names are numbered for sorting ("1. Holidays"); the card text drops the number.
  // A topic whose one page has the topic's own name says nothing more than its title.
  const names = pages
    .map(page => page.text.replace(/^\d+[.)]\s*/, ''))
    .filter(name => name.toLowerCase() !== item.text.toLowerCase())
  const shown = names.slice(0, 3)
  const rest = names.length - shown.length
  const body = shown.length
    ? shown.join(', ') + (rest > 0 ? ` and ${rest} more` : '')
    : undefined
  return {
    title: item.text,
    href: firstLink(item) ?? '/',
    body: body && !/[.!?…]$/.test(body) ? `${body}.` : body,
    meta: pages.length > 1 ? `${pages.length} pages` : undefined,
  }
}))
</script>

<template>
  <div class="layout">
    <a class="layout__skip-link app-button app-button--small small font-bold" :href="`#${skipTarget}`" @click.prevent="skipToContent"><span>Skip to content</span></a>
    <AppHeader />

    <main v-if="isHome" id="main">
      <HeroHeader
        :title="frontmatter.title"
        :intro="frontmatter.tagline"
        :image="frontmatter.heroImage"
      />
      <section class="container layout__topics" aria-labelledby="topics-title">
        <div class="layout__topics-head">
          <h2 id="topics-title" class="h2">Topics</h2>
          <AppButton v-if="firstPage" :label="frontmatter.actionText" :to="firstPage" secondary />
        </div>
        <ul class="layout__cards">
          <li v-for="section in sections" :key="section.title">
            <ContentCard v-bind="section" />
          </li>
        </ul>
      </section>
    </main>

    <main v-else-if="isNotFound" id="main" class="layout__not-found">
      <HeroHeader title="Page not found" />
      <div class="container layout__not-found-body">
        <p class="lead">This page isn’t in the playbook (anymore). Search for it, or start from the home page.</p>
        <AppButton label="Go to the home page" to="/" />
      </div>
    </main>

    <main v-else id="main">
      <HeroHeader :title="page.title" />
      <div class="container layout__page">
        <PlaybookSidebar class="layout__sidebar" />
        <div class="layout__main">
          <TocSection variant="bar" />
          <!-- The skip link lands here, past the title and the navigation. -->
          <article id="content" class="layout__article" tabindex="-1" :aria-label="page.title">
            <PageMetadata
              :id="frontmatter.doc_id"
              :date="frontmatter.last_updated_date"
              :edit-link="frontmatter.edit_link"
            />
            <Content class="layout__content body" />
            <BreadcrumbsBlock :previous="previous" :next="next" />
          </article>
        </div>
        <aside class="layout__aside">
          <TocSection variant="side" />
        </aside>
      </div>
    </main>

    <AppMobileMenu />
    <AppFooter />
  </div>
</template>

<style>
/* The sidebar's ground runs out to the left edge of the window; nothing else may widen the page. */
.layout {
  overflow-x: clip;
}

.layout__skip-link.app-button {
  position: absolute;
  z-index: var(--z-index-skip-link);
  top: var(--spacing-15);
  left: -9999rem;
}

.layout__skip-link:focus {
  left: var(--spacing-15);
}

/* Home page */
.layout__topics {
  padding-block: var(--block-spacing);
}

.layout__topics-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-20) var(--spacing-40);
  margin-bottom: var(--spacing-40);
}

.layout__cards {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-30);
}

@media (min-width: 720px) {
  .layout__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .layout__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Not found */
.layout__not-found-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-30);
  padding-block: var(--block-spacing);
}

/* Docs page */
.layout__sidebar,
.layout__aside {
  display: none;
}

.layout__main {
  min-width: 0;
}

.layout__article {
  padding: var(--spacing-40) 0 var(--block-spacing);
}

.layout__article:focus {
  outline: none;
}

.layout__article .breadcrumbs-block {
  margin-top: var(--spacing-60);
}

/* Below 800px the text takes the full width of the container; the bar runs edge to edge. */
.layout__main > .toc-section__bar {
  margin-inline: calc(-1 * var(--grid-margin));
}

@media (min-width: 720px) {
  .layout__main > .toc-section__bar {
    margin-inline: calc(-2 * var(--grid-margin));
  }
}

@media (min-width: 800px) {
  .layout__page {
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
    column-gap: var(--spacing-40);
  }

  .layout__sidebar {
    display: block;
  }

  .layout__main > .toc-section__bar {
    margin-inline: 0;
  }

  .layout__article {
    max-width: 46rem;
  }
}

@media (min-width: 1100px) {
  .layout__page {
    grid-template-columns: 18rem minmax(0, 1fr);
    column-gap: var(--spacing-60);
  }

  .layout__article {
    padding-top: var(--spacing-60);
  }
}

@media (min-width: 1280px) {
  .layout__page {
    grid-template-columns: 18rem minmax(0, 46rem) 15rem;
    justify-content: space-between;
  }

  .layout__aside {
    display: block;
    padding-top: var(--spacing-60);
  }

  .layout__main > .toc-section__bar {
    display: none;
  }
}

/* The Drive content */
.layout__content {
  overflow-wrap: break-word;
}

.layout__content > :first-child {
  margin-top: 0;
}

.layout__content :is(h2, h3, h4, h5, h6) {
  position: relative;
  color: var(--blue);
  font-weight: 700;
}

.layout__content h2 {
  margin: var(--spacing-60) 0 var(--spacing-20);
  font-size: clamp(1.9375rem, 1.502rem + 2.179vw, 3rem);
  line-height: 1.25;
}

.layout__content :is(h3, h4, h5, h6) {
  margin: var(--spacing-40) 0 var(--spacing-15);
  font-size: clamp(1.5rem, 1.269rem + 1.154vw, 2.0625rem);
  line-height: 1.3;
}

.layout__content .header-anchor {
  position: absolute;
  left: -.8em;
  padding-right: .2em;
  opacity: 0;
  background: none;
}

.layout__content .header-anchor::before {
  content: '#';
}

.layout__content :is(h2, h3, h4, h5, h6):hover .header-anchor,
.layout__content .header-anchor:focus {
  opacity: 1;
}

.layout__content :is(p, ul, ol, table, blockquote):not(:last-child) {
  margin-bottom: var(--spacing-30);
}

@media (min-width: 720px) {
  .layout__content :is(p, ul, ol, table, blockquote):not(:last-child) {
    margin-bottom: var(--spacing-40);
  }
}

.layout__content a {
  padding-bottom: .15rem;
  color: var(--blue);
  background: transparent linear-gradient(to top, transparent 1px, var(--blue) 1px, var(--blue) 2px, transparent 2px);
}

.layout__content a:hover,
.layout__content a:focus {
  color: var(--blue-dark);
  background: transparent linear-gradient(to top, var(--blue) 2px, transparent 2px);
}

.layout__content code {
  padding: .1em .25rem;
  background-color: var(--yellow-light);
  color: var(--blue-dark);
  font-family: var(--font-code);
  font-size: max(1rem, .9em);
}

.layout__content a > code {
  color: inherit;
  background: transparent linear-gradient(to top, transparent 2px, var(--yellow-light) 1px);
}

.layout__content :is(ul, ol) {
  padding-left: var(--spacing-30);
}

.layout__content p + :is(ul, ol) {
  margin-top: calc(-1 * var(--spacing-15));
}

.layout__content ol {
  list-style: decimal;
}

.layout__content li > :is(ul, ol),
.layout__content li + li {
  margin-top: var(--spacing-5);
}

.layout__content ul > li {
  position: relative;
}

/* The bullet: a dot in the middle of the x-height. */
.layout__content ul > li::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--spacing-15) + 1px);
  width: 3px;
  height: 3px;
  margin-top: calc(.8em - 1px);
  background-color: currentColor;
  border-radius: 50%;
}

@media (min-width: 1100px) {
  .layout__content ul > li::before {
    left: calc(-1 * var(--spacing-30) + 1px);
  }
}

.layout__content img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Tables scroll sideways on small screens instead of widening the page. */
.layout__content table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.layout__content tr {
  border-bottom: 1px solid var(--gray);
  font-size: 1rem;
  line-height: 1.5;
}

.layout__content thead tr {
  border-bottom-width: 2px;
  color: var(--blue);
}

.layout__content th {
  padding: var(--spacing-30) var(--spacing-5);
  font-weight: 700;
  vertical-align: bottom;
}

.layout__content td {
  padding: var(--spacing-15) var(--spacing-5);
  text-align: center;
}

.layout__content blockquote {
  padding: var(--spacing-30);
  background-color: var(--yellow-light);
}

.layout__content blockquote > * + * {
  margin-top: var(--spacing-15);
}

/* A horizontal rule becomes space: blocks are set apart by space and ground, not by lines. */
.layout__content hr {
  height: 0;
  margin: var(--spacing-40) 0;
  border: 0;
}
</style>
