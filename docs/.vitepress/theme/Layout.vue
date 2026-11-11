<script setup lang="ts">
/**
 * The playbook's page, built from the De Voorhoede design system (see design-system/).
 * Every page: AppHeader, one page header, the page's blocks, AppFooter; AppMobileMenu below 800px.
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import AppHeader from './components/AppHeader.vue'
import AppMobileMenu from './components/AppMobileMenu.vue'
import AppFooter from './components/AppFooter.vue'
import HomeHero from './components/HomeHero.vue'
import HeroHeader from './components/HeroHeader.vue'
import CardGrid from './components/CardGrid.vue'
import ContentCard from './components/ContentCard.vue'
import AppButton from './components/AppButton.vue'
import PlaybookSidebar from './components/PlaybookSidebar.vue'
import PageMetadata from './components/PageMetadata.vue'
import TocSection from './components/TocSection.vue'
import BreadcrumbsBlock from './components/BreadcrumbsBlock.vue'
import { firstLink, flatten, useNavigation } from './navigation'

const { page, frontmatter } = useData()
const { sidebar, previous, next } = useNavigation()

const isHome = computed(() => frontmatter.value.layout === 'home')
const isNotFound = computed(() => page.value.isNotFound)

/* One card per top-level part of the playbook, for the home page. */
const sections = computed(() => sidebar.value.map(item => {
  const pages = item.items ? flatten(item.items) : []
  // Drive file names are numbered for sorting ("1. Holidays"); the card text drops the number.
  const names = pages.slice(0, 3).map(page => page.text.replace(/^\d+[.)]\s*/, ''))
  const rest = pages.length - names.length
  return {
    title: item.text,
    href: firstLink(item) ?? '/',
    body: item.items ? names.join(', ') + (rest > 0 ? ` and ${rest} more.` : '.') : undefined,
    meta: item.items ? `${pages.length} ${pages.length === 1 ? 'page' : 'pages'}` : undefined,
  }
}))
</script>

<template>
  <div class="playbook">
    <a class="skip-link app-button app-button--small small font-bold" href="#main"><span>Skip to content</span></a>
    <AppHeader />

    <main v-if="isHome" id="main" class="playbook-home">
      <HomeHero
        :title="frontmatter.heroText ?? 'Playbook'"
        :intro="frontmatter.tagline"
        :illustration="frontmatter.heroImage"
      />
      <CardGrid title="What’s in the playbook">
        <template v-if="frontmatter.actionLink" #action>
          <AppButton :label="frontmatter.actionText ?? 'Start reading'" :to="frontmatter.actionLink" secondary />
        </template>
        <li v-for="section in sections" :key="section.title">
          <ContentCard v-bind="section" />
        </li>
      </CardGrid>
    </main>

    <main v-else-if="isNotFound" id="main" class="playbook-not-found">
      <HeroHeader title="Page not found" />
      <div class="playbook-not-found__body grid">
        <p class="lead section-text">This page isn’t in the playbook (anymore). Search for it, or start from the home page.</p>
        <div class="section-text">
          <AppButton label="Go to the home page" to="/" />
        </div>
      </div>
    </main>

    <template v-else>
      <HeroHeader :title="page.title" />
      <div class="playbook-page">
        <PlaybookSidebar class="playbook-page__sidebar" />
        <main id="main" class="playbook-page__main">
          <TocSection variant="bar" class="playbook-page__toc-bar" />
          <div class="playbook-article">
            <article class="playbook-article__body">
              <PageMetadata
                :id="frontmatter.doc_id"
                :date="frontmatter.last_updated_date"
                :edit-link="frontmatter.edit_link"
              />
              <Content class="playbook-content rich-text body list" />
              <BreadcrumbsBlock :previous="previous" :next="next" />
            </article>
            <aside class="playbook-article__aside">
              <TocSection variant="side" />
            </aside>
          </div>
        </main>
      </div>
    </template>

    <AppMobileMenu />
    <AppFooter />
  </div>
</template>
