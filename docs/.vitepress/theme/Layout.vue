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
