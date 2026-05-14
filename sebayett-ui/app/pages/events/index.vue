<script setup lang="ts">
import { computed, ref } from 'vue'
import FrontendCard from '~/components/public/cards/FrontendCard.vue'
import Pagination from '~/components/public/ui/Pagination.vue'
import {
  eventsHeading,
  eventsList,
  eventsPageSize,
} from '~/config/events.content'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(() => `${siteUrl.value}/events`)

const pageTitle = 'Events — Sebayett'
const pageDescription =
  'Discover live events, workshops, and community sessions on Sebayett.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: canonicalHref,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: canonicalHref }],
})

const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(eventsList.length / eventsPageSize)),
)

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * eventsPageSize
  return eventsList.slice(start, start + eventsPageSize)
})

function onPageChange() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <section
    aria-labelledby="events-heading"
    class="relative pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16"
  >
    <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
      <h1
        id="events-heading"
        class="text-center text-4xl font-bold tracking-tight text-neutral-900 leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
      >
        {{ eventsHeading }}
      </h1>

      <div
        class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7"
      >
        <FrontendCard
          v-for="evt in paginatedEvents"
          :key="evt.id"
          :image-src="evt.imageSrc"
          :image-alt="evt.imageAlt"
          :badge="evt.badge"
          :title="evt.title"
          :description="evt.description"
          :cta-label="evt.ctaLabel"
          :cta-to="evt.ctaTo"
        />
      </div>

      <Pagination
        v-model="currentPage"
        variant="minimal"
        :total-pages="totalPages"
        @update:model-value="onPageChange"
      />
    </div>
  </section>
</template>
