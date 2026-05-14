<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumbs from '~/components/public/ui/Breadcrumbs.vue'
import LessonBookSummaryCard from '~/components/public/lessons/LessonBookSummaryCard.vue'
import LessonBookingFormCard from '~/components/public/lessons/LessonBookingFormCard.vue'
import { findLessonById } from '~/config/lessons.content'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const route = useRoute()

const lesson = computed(() => findLessonById(String(route.params.id)))

if (!lesson.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Lesson not found',
    fatal: true,
  })
}

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(
  () => `${siteUrl.value}/lessons/${lesson.value!.id}/book`,
)

const pageTitle = computed(
  () => `Book ${lesson.value!.title} — Sebayett`,
)
const pageDescription = computed(
  () =>
    `Book ${lesson.value!.title}. ${lesson.value!.detailDescription}`,
)

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

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Lessons', to: '/lessons' },
  { label: lesson.value!.title, to: `/lessons/${lesson.value!.id}` },
  { label: 'Book Lesson' },
])
</script>

<template>
  <section
    v-if="lesson"
    class="relative pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28 lg:pt-12"
    aria-labelledby="book-lesson-heading"
  >
    <div class="px-3 sm:px-4 lg:px-6">
      <div class="mx-auto w-full max-w-7xl py-8">
        <h1 id="book-lesson-heading" class="sr-only">
          Book {{ lesson.title }}
        </h1>

        <Breadcrumbs
          :items="breadcrumbItems"
          separator-tone="brand"
        />

        <div class="mt-8 space-y-6">
          <LessonBookSummaryCard :lesson="lesson" />
          <LessonBookingFormCard />
        </div>
      </div>
    </div>
  </section>
</template>
