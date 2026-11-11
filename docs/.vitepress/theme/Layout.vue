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
  <div class="playbook">
    <a class="skip-link app-button app-button--small small font-bold" :href="`#${skipTarget}`" @click.prevent="skipToContent"><span>Skip to content</span></a>
    <AppHeader />

    <main v-if="isHome" id="main" class="playbook-home">
      <HeroHeader
        :title="frontmatter.title"
        :intro="frontmatter.tagline"
        :image="frontmatter.heroImage"
      />
      <section class="playbook-container playbook-topics" aria-labelledby="topics-title">
        <div class="playbook-topics__head">
          <h2 id="topics-title" class="h2">Topics</h2>
          <AppButton v-if="firstPage" :label="frontmatter.actionText" :to="firstPage" secondary />
        </div>
        <ul class="card-grid__list card-grid__list--3">
          <li v-for="section in sections" :key="section.title">
            <ContentCard v-bind="section" />
          </li>
        </ul>
      </section>
    </main>

    <main v-else-if="isNotFound" id="main" class="playbook-not-found">
      <HeroHeader title="Page not found" />
      <div class="playbook-container playbook-not-found__body">
        <p class="lead">This page isn’t in the playbook (anymore). Search for it, or start from the home page.</p>
        <AppButton label="Go to the home page" to="/" />
      </div>
    </main>

    <main v-else id="main">
      <HeroHeader :title="page.title" />
      <div class="playbook-container playbook-page">
        <PlaybookSidebar class="playbook-page__sidebar" />
        <div class="playbook-page__main">
          <TocSection variant="bar" />
          <!-- The skip link lands here, past the title and the navigation. -->
          <article id="content" class="playbook-article" tabindex="-1" :aria-label="page.title">
            <PageMetadata
              :id="frontmatter.doc_id"
              :date="frontmatter.last_updated_date"
              :edit-link="frontmatter.edit_link"
            />
            <Content class="playbook-content rich-text body list" />
            <BreadcrumbsBlock :previous="previous" :next="next" />
          </article>
        </div>
        <aside class="playbook-page__aside">
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
.playbook {
  overflow-x: clip;
}

.playbook-page__sidebar,
.playbook-page__aside {
  display: none;
}

.playbook-page__main {
  min-width: 0;
}

.playbook-article {
  padding: var(--spacing-40) 0 var(--block-spacing);
}

.playbook-article:focus {
  outline: none;
}

/* Below 800px the text takes the full width of the container; the bar runs edge to edge. */
.playbook-page__main > .toc-section__bar {
  margin-inline: calc(-1 * var(--grid-margin));
}

@media (min-width: 720px) {
  .playbook-page__main > .toc-section__bar {
    margin-inline: calc(-2 * var(--grid-margin));
  }

  .playbook-page__main > .toc-section__bar {
    display: block;
  }
}

@media (min-width: 800px) {
  .playbook-page {
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
    column-gap: var(--spacing-40);
  }

  .playbook-page__sidebar {
    display: block;
  }

  .playbook-page__main > .toc-section__bar {
    margin-inline: 0;
  }

  .playbook-article {
    max-width: 46rem;
  }
}

@media (min-width: 1100px) {
  .playbook-page {
    grid-template-columns: 18rem minmax(0, 1fr);
    column-gap: var(--spacing-60);
  }

  .playbook-article {
    padding-top: var(--spacing-60);
  }
}

@media (min-width: 1280px) {
  .playbook-page {
    grid-template-columns: 18rem minmax(0, 46rem) 15rem;
    justify-content: space-between;
  }

  .playbook-page__aside {
    display: block;
    padding-top: var(--spacing-60);
  }

  .playbook-page__main > .toc-section__bar {
    display: none;
  }
}

.playbook-content h2,
.playbook-content h3,
.playbook-content h4,
.playbook-content h5,
.playbook-content h6 {
  position: relative;
}

.playbook-content h2 {
  margin: var(--spacing-60) 0 var(--spacing-20);
}

.playbook-content h3,
.playbook-content h4,
.playbook-content h5,
.playbook-content h6 {
  margin: var(--spacing-40) 0 var(--spacing-15);
}

.playbook-content > :first-child {
  margin-top: 0;
}

.playbook-content .header-anchor {
  position: absolute;
  left: -.8em;
  padding-right: .2em;
  opacity: 0;
  text-decoration: none;
  background: none;
}

.playbook-content .header-anchor::before {
  content: '#';
}

.playbook-content :is(h2, h3, h4, h5, h6):hover .header-anchor,
.playbook-content .header-anchor:focus {
  opacity: 1;
}

.playbook-content li > ul,
.playbook-content li > ol {
  margin-top: var(--spacing-5);
}

.playbook-content ol > li + li {
  margin-top: var(--spacing-5);
}

.playbook-content img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Tables scroll sideways on small screens instead of widening the page. */
.playbook-content table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.playbook-content th {
  padding: var(--spacing-30) var(--spacing-5);
  font-weight: 700;
  vertical-align: bottom;
}

/* Markdown tables have a <thead>: the header style of RichTextBlock goes to that row only. */
.playbook-content thead + tbody tr:first-child {
  border-bottom: 1px solid var(--gray);
  color: var(--black);
}

.playbook-content thead + tbody tr:first-child td {
  padding: var(--spacing-15) var(--spacing-5);
  font-weight: 400;
  vertical-align: top;
}

.playbook-content blockquote {
  padding: var(--spacing-30);
  background-color: var(--yellow-light);
}

.playbook-content blockquote > * + * {
  margin-top: var(--spacing-15);
}

/* A horizontal rule becomes space: blocks are set apart by space and ground, not by lines. */
.playbook-content hr {
  height: 0;
  margin: var(--spacing-40) 0;
  border: 0;
}

.playbook-content blockquote {
  margin-bottom: var(--spacing-30);
}

@media (min-width: 720px) {
  .playbook-content blockquote {
    margin-bottom: var(--spacing-40);
  }
}

.playbook-content blockquote:last-child {
  margin-bottom: 0;
}

.playbook-article .breadcrumbs-block {
  margin-top: var(--spacing-60);
}

.playbook-topics {
  padding-block: var(--block-spacing);
}

.playbook-topics__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-20) var(--spacing-40);
  margin-bottom: var(--spacing-40);
}

.playbook-not-found__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-30);
  padding-block: var(--block-spacing);
}
</style>
