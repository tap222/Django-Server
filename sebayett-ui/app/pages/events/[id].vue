<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, Clock, MapPin } from 'lucide-vue-next'
import EventTicketSuccessModal from '~/components/public/events/EventTicketSuccessModal.vue'
import Breadcrumbs from '~/components/public/ui/Breadcrumbs.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'
import { findEventById } from '~/config/events.content'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const route = useRoute()

const event = computed(() => findEventById(String(route.params.id)))

if (!event.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Event not found',
    fatal: true,
  })
}

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(
  () => `${siteUrl.value}/events/${event.value!.id}`,
)

const pageTitle = computed(() => `${event.value!.title} — Sebayett`)
const pageDescription = computed(() => event.value!.description)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: canonicalHref,
  ogImage: computed(() => event.value!.imageSrc),
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: computed(() => event.value!.imageSrc),
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: canonicalHref }],
})

const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: event.value!.title },
])

const ticketSuccessOpen = ref(false)
</script>

<template>
  <section
    v-if="event"
    class="relative pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28 lg:pt-12"
    aria-labelledby="event-detail-heading"
  >
    <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
      <Breadcrumbs
          :items="breadcrumbItems"
          separator-tone="brand"
        />

      <div class="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-4">
        <article
          class="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 lg:col-span-8"
        >
          <h1
            id="event-detail-heading"
            class="text-4xl font-bold tracking-tight text-brand leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
          >
            {{ event.title }}
          </h1>
          <p
            class="mt-4 font-semibold text-base leading-relaxed text-neutral-700 sm:text-lg"
          >
            {{ event.description }}
          </p>

          <ul class="mt-6 space-y-3 text-sm sm:text-base">
            <li class="flex items-center gap-3 text-neutral-800">
              <MapPin class="size-5 shrink-0 text-brand" aria-hidden="true" />
              <span class="font-semibold">{{ event.badge }}</span>
            </li>
            <li class="flex items-center gap-3 text-neutral-800">
              <Calendar
                class="size-5 shrink-0 text-brand"
                aria-hidden="true"
              />
              <span class="font-semibold">{{ event.date }}</span>
            </li>
            <li class="flex items-center gap-3 text-neutral-800">
              <Clock class="size-5 shrink-0 text-brand" aria-hidden="true" />
              <span class="font-semibold">{{ event.time }}</span>
            </li>
          </ul>

          <div class="mt-auto pt-8">
            <PrimaryButton
              variant="primary"
              class="w-full rounded-lg"
              @click="ticketSuccessOpen = true"
            >
              Buy Ticket
            </PrimaryButton>
          </div>
        </article>

        <div
          class="relative aspect-[4/2.5] w-full overflow-hidden rounded-2xl bg-neutral-100 lg:col-span-4 lg:col-start-9 lg:self-start"
        >
          <img
            :src="event.imageSrc"
            :alt="event.imageAlt"
            class="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            width="800"
            height="500"
          >
        </div>
      </div>
    </div>

    <EventTicketSuccessModal v-model="ticketSuccessOpen" />
  </section>
</template>
