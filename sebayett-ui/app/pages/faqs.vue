<script setup lang="ts">
import { computed } from 'vue'
import Accordion from '~/components/public/ui/Accordion.vue'
import { landingFaqIntro, landingFaqItems } from '~/config/landing.content'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(() => `${siteUrl.value}/faqs`)

const pageTitle = 'FAQs — Sebayett'
const pageDescription = landingFaqIntro.description

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
</script>

<template>
  <section
    aria-labelledby="faqs-heading"
    class="relative overflow-hidden pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16"
  >
    <div class="relative mx-auto max-w-3xl px-3 sm:px-4 lg:px-6">
      <header class="text-center motion-safe:animate-fade-up">
        <h1
          id="faqs-heading"
          class="text-balance text-4xl font-bold tracking-tight text-neutral-900 leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
        >
          {{ landingFaqIntro.title }}
        </h1>
        <p
          class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {{ landingFaqIntro.description }}
        </p>
      </header>

      <div class="mx-auto mt-10 w-full max-w-xl sm:mt-12">
        <div
          class="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <Accordion :items="landingFaqItems" />
        </div>
      </div>
    </div>
  </section>
</template>
