<script setup lang="ts">
import { computed } from 'vue'
import Breadcrumbs from '~/components/public/ui/Breadcrumbs.vue'
import LessonScheduleTable from '~/components/public/lessons/LessonScheduleTable.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'
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
  () => `${siteUrl.value}/lessons/${lesson.value!.id}`,
)

const pageTitle = computed(() => `${lesson.value!.title} — Sebayett`)
const pageDescription = computed(() => lesson.value!.detailDescription)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: canonicalHref,
  ogImage: computed(() => lesson.value!.imageSrc),
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: computed(() => lesson.value!.imageSrc),
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: canonicalHref }],
})

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Lessons', to: '/lessons' },
  { label: lesson.value!.title },
])

const bookLessonTo = computed(
  () => `/lessons/${lesson.value!.id}/book`,
)
</script>

<template>
  <section
    v-if="lesson"
    class="relative pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28 lg:pt-12"
    aria-labelledby="lesson-detail-heading"
  >
    <div class="px-3 sm:px-4 lg:px-6">
      <div class="mx-auto w-full max-w-7xl">
        <Breadcrumbs
          :items="breadcrumbItems"
          separator-tone="brand"
        />

        <div
          class="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.2fr_0.85fr] lg:items-start"
        >
          <article
            class="flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
          >
            <h1
              id="lesson-detail-heading"
              class="text-4xl font-bold tracking-tight text-brand leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
            >
              {{ lesson.title }}
            </h1>
            <p
              class="mt-4 text-sm font-medium leading-7 text-neutral-700 sm:text-base sm:leading-8"
            >
              {{ lesson.detailDescription }}
            </p>
            <p class="mt-6 text-sm text-neutral-700 sm:text-base">
              <span class="font-normal">Category: </span>
              <span class="font-bold">{{ lesson.badge }}</span>
            </p>

            <div class="mt-6">
              <LessonScheduleTable :rows="lesson.schedule" />
            </div>

            <div class="mt-8">
              <PrimaryButton
                variant="primary"
                :to="bookLessonTo"
                class="h-12 w-full rounded-lg hover:opacity-90"
              >
                Book Lesson
              </PrimaryButton>
            </div>
          </article>

          <div
            class="relative aspect-video w-full overflow-hidden rounded-3xl bg-neutral-100 lg:self-start"
          >
            <img
              :src="lesson.imageSrc"
              :alt="lesson.imageAlt"
              class="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              width="960"
              height="540"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
