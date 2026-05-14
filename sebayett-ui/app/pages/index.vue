<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import Accordion from '~/components/public/ui/Accordion.vue'
import FeatureCard from '~/components/public/cards/FeatureCard.vue'
import HeroDiscordIcon from '~/components/public/ui/HeroDiscordIcon.vue'
import InstructorCard from '~/components/public/cards/InstructorCard.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'
import PublicBadge from '~/components/public/ui/PublicBadge.vue'
import SectionTitle from '~/components/public/ui/SectionTitle.vue'
import StepCard from '~/components/public/cards/StepCard.vue'
import {
  landingCommunity,
  landingFaqIntro,
  landingFaqItems,
  landingFeatures,
  landingHero,
  landingInstructors,
  landingInstructorsCta,
  landingSectionTitles,
  landingServer,
  landingSteps,
} from '~/config/landing.content'
import { useAuthModal } from '~/composables/useAuthModal'

definePageMeta({
  layout: 'landing',
  public: true,
})

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(() => `${siteUrl.value}/`)

/** Vertical stagger: odd positions high, even positions low (zigzag on lg+). */
const instructorStaggerClasses = [
  'lg:translate-y-0',
  'lg:translate-y-9',
  'lg:translate-y-0',
  'lg:translate-y-9',
  'lg:translate-y-0',
] as const

const pageTitle = 'Sebayett — Empower your Discord community'
const pageDescription =
  'Personalized coaching and strategies for server owners to grow and engage their communities.'

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

const { openAuthModal } = useAuthModal()
</script>

<template>
  <div>
    <!-- Hero — radial bg, orbs, CTAs; heading uses site sans (Inter) to match nav -->
    <section aria-labelledby="hero-heading" class="relative overflow-hidden bg-hero-radial">
      <div class="hero-blob-tl" aria-hidden="true" />
      <div class="hero-blob-br" aria-hidden="true" />

      <!-- Same width + gutters as PublicHeader (max-w-7xl + px) so hero aligns with nav -->
      <div
        class="relative mx-auto w-full max-w-7xl px-3 py-16 sm:px-4 md:py-24 lg:px-6"
      >
        <!-- Orbs beside headline only; vertically centered with h1, tight horizontal gap -->
        <div class="relative z-10 w-full min-w-0 text-center">
          <div
            class="md:grid md:grid-cols-[160px_minmax(0,1fr)_160px] md:items-center md:gap-x-0 lg:gap-x-1"
          >
            <div
              class="pointer-events-none hidden justify-end md:flex"
              aria-hidden="true"
            >
              <div
                class="relative flex size-[90px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 motion-safe:animate-hero-orb motion-reduce:animate-none"
              >
                <span
                  class="pointer-events-none absolute inset-[5px] rounded-full border-2 border-white/35"
                  aria-hidden="true"
                />
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 24 24"
                  fill="white"
                  class="relative z-10 shrink-0 -rotate-[20deg]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="white"
                    stroke-width="0"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <h1
              id="hero-heading"
              class="mb-6 text-balance font-sans text-4xl font-extrabold leading-[1.1] tracking-[-0.02em] text-neutral-900 motion-safe:animate-hero-fade-up motion-reduce:opacity-100 sm:text-5xl sm:leading-[1.09] md:text-5xl lg:text-[4.75rem] lg:leading-[1.08] md:col-start-2 md:row-start-1"
            >
              <span class="block">{{ landingHero.heroLine1 }}</span>
              <span class="block">{{ landingHero.heroLine2 }}</span>
              <span class="block text-orange-500">{{ landingHero.heroBrand }}</span>
            </h1>

            <div
              class="pointer-events-none hidden justify-start md:flex"
              aria-hidden="true"
            >
              <div
                class="relative flex size-[90px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 motion-safe:animate-hero-orb motion-safe:[animation-delay:1.5s] motion-reduce:animate-none"
              >
                <span
                  class="pointer-events-none absolute inset-[5px] rounded-full border-2 border-white/35"
                  aria-hidden="true"
                />
                <HeroDiscordIcon
                  ui-class="relative z-10 shrink-0 text-white rotate-[20deg]"
                />
              </div>
            </div>
          </div>

          <p
            class="mb-10 text-pretty font-dm text-lg font-normal leading-relaxed motion-safe:animate-hero-fade-up motion-safe:[animation-delay:150ms] motion-reduce:opacity-100 sm:text-xl sm:leading-snug md:text-2xl md:leading-[1.75rem]"
          >
            {{ landingHero.subtextLine1 }}
            <br class="hidden md:block" />
            {{ landingHero.subtextLine2 }}
          </p>
          <div
            class="flex flex-col items-center justify-center gap-4 sm:flex-row motion-safe:animate-hero-fade-up motion-safe:[animation-delay:300ms] motion-reduce:opacity-100"
          >
            <PrimaryButton
              preset="landing"
              variant="primary"
              :to="landingHero.primaryCta.to"
            >
              {{ landingHero.primaryCta.label }}
            </PrimaryButton>
            <PrimaryButton
              preset="landing"
              variant="secondary"
              @click="openAuthModal"
            >
              {{ landingHero.secondaryCta.label }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose -->
    <section id="why-sebayett" aria-labelledby="why-heading" class="bg-[#FFFFFF] py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <SectionTitle :title="landingSectionTitles.why" title-id="why-heading" align="center"
          brand-highlight-word="Sebayett" />
        <div class="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-3">
          <FeatureCard v-for="f in landingFeatures" :key="f.title" :image-src="f.imageSrc" :image-alt="f.imageAlt"
            :title="f.title" :description="f.description" />
        </div>
      </div>
    </section>

    <!-- Community -->
    <section id="community" aria-labelledby="community-heading" class="bg-[#FFFFFF] py-20 sm:py-24 lg:py-28">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div class="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:gap-y-7 xl:gap-x-20">
          <span
            class="inline-flex w-fit items-center rounded-full border border-orange-500 bg-orange-50 px-5 py-2 text-sm font-bold text-orange-500 motion-safe:animate-fade-up">
            {{ landingCommunity.badge }}
          </span>

          <div class="motion-safe:animate-fade-up min-w-0 lg:row-start-2 lg:max-w-xl">
            <h2 id="community-heading" class="landing-section-title">
              {{ landingCommunity.title }}
            </h2>
            <p class="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
              {{ landingCommunity.intro }}
            </p>
            <ul class="mt-5 space-y-2.5">
              <li v-for="(line, idx) in landingCommunity.bullets" :key="idx"
                class="flex gap-2.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">
                <span
                  class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-brand ring-1 ring-brand/15"
                  aria-hidden="true">
                  <Check class="size-3 sm:size-3.5" stroke-width="2.5" />
                </span>
                {{ line }}
              </li>
            </ul>
            <p class="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
              {{ landingCommunity.outro }}
            </p>
            <div class="mt-4">
              <PrimaryButton
                preset="landing"
                variant="primary"
                :to="landingCommunity.cta.to"
              >
                {{ landingCommunity.cta.label }}
              </PrimaryButton>
            </div>
          </div>

          <div
            class="mx-auto w-full max-w-2xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms] lg:row-start-2 lg:mx-0 lg:max-w-none">
            <div class="grid grid-cols-[minmax(0,1fr)_auto] items-stretch">
              <div class="min-w-0 overflow-hidden rounded-2xl ring-1 ring-neutral-200/80">
                <img :src="landingCommunity.imageSrc" :alt="landingCommunity.imageAlt"
                  class="aspect-[4/3] w-full object-cover sm:aspect-[5/4]" loading="lazy" decoding="async" width="1200"
                  height="1000">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" aria-labelledby="how-heading" class="w-full">
      <div
        class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 bg-gradient-to-b from-white via-orange-50/25 to-orange-50/55 pt-10 pb-10 border border-brand/35 bg-brand/[0.07] rounded-lg">
        <SectionTitle :title="landingSectionTitles.how" title-id="how-heading" align="center"
          brand-highlight-word="Sebayett" />
        <div class="relative mt-12 lg:mt-16">
          <div
            class="pointer-events-none absolute left-[13%] right-[13%] top-8 z-0 hidden h-0 border-t-2 border-dashed border-brand/45 sm:block sm:top-9 sm:left-[14%] sm:right-[14%] lg:top-10"
            aria-hidden="true" />
          <div class="relative z-[1] grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            <StepCard v-for="step in landingSteps" :key="step.step" :step="step.step" :icon="step.icon"
              :description="step.description" />
          </div>
        </div>
      </div>
    </section>

    <!-- Servers -->
    <section id="servers" aria-labelledby="servers-heading" class="py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div
            class="relative order-2 mx-auto w-full max-w-lg lg:order-1 lg:mx-0 lg:max-w-none motion-safe:animate-fade-up">
            <div
              class="relative z-10 overflow-hidden rounded-2xl ring-1 ring-neutral-200/80 shadow-sm shadow-neutral-900/5">
              <img :src="landingServer.imageSrc" :alt="landingServer.imageAlt"
                class="aspect-[4/3] w-full object-cover sm:aspect-[5/4]" loading="lazy" decoding="async" width="960"
                height="768">
            </div>
          </div>

          <div class="order-1 motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:order-2 lg:max-w-xl">
            <PublicBadge>{{ landingServer.badge }}</PublicBadge>
            <h2 id="servers-heading" class="landing-section-title mt-3">
              {{ landingServer.title }}
            </h2>
            <p class="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-[0.9375rem]">
              {{ landingServer.body }}
            </p>
            <div class="mt-6">
              <PrimaryButton
                preset="landing"
                variant="primary"
                @click="openAuthModal"
              >
                {{ landingServer.cta.label }}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Instructors -->
    <section id="instructors" aria-labelledby="instructors-heading"
      class="relative overflow-hidden bg-[radial-gradient(ellipse_90%_60%_at_50%_38%,rgba(255,122,0,0.08),transparent_55%),linear-gradient(180deg,#fffefb_0%,#ffffff_50%,#ffffff_100%)] py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <SectionTitle :title="landingSectionTitles.instructors" title-id="instructors-heading" align="center" />

        <!-- Mobile: horizontal scroll-snap carousel (< sm only) -->
        <div class="mt-12 sm:hidden">
          <div
            role="region"
            aria-label="Instructors"
            tabindex="0"
            class="-mx-3 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-3 pb-2 touch-pan-x [-webkit-overflow-scrolling:touch] [scroll-padding-inline:0.75rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div
              v-for="(inst, idx) in landingInstructors"
              :key="`instructors-carousel-${idx}-${inst.name}`"
              class="w-[min(100%,248px)] shrink-0 snap-center"
            >
              <InstructorCard
                :name="inst.name"
                :role="inst.role"
                :image-src="inst.imageSrc"
                :image-alt="inst.imageAlt"
                :rating="inst.rating"
                :student-count="inst.studentCount"
              />
            </div>
          </div>
        </div>

        <!-- Tablet & desktop: existing grid (unchanged from sm breakpoint up) -->
        <div
          class="mt-12 hidden sm:grid sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-5 lg:items-start lg:gap-5">
          <div v-for="(inst, idx) in landingInstructors" :key="`${idx}-${inst.name}`"
            class="mx-auto w-full max-w-[248px] motion-safe:transition-transform motion-safe:duration-300"
            :class="instructorStaggerClasses[idx] ?? ''">
            <InstructorCard :name="inst.name" :role="inst.role" :image-src="inst.imageSrc" :image-alt="inst.imageAlt"
              :rating="inst.rating" :student-count="inst.studentCount" />
          </div>
        </div>
        <div class="mx-auto mt-14 max-w-2xl text-center motion-safe:animate-fade-up">
          <p class="text-base leading-relaxed text-neutral-600 sm:text-lg">
            {{ landingInstructorsCta.lineLead }}
            {{ ' ' }}
            <NuxtLink :to="landingInstructorsCta.lineLinkTo"
              class="font-semibold text-brand underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              @click.prevent="openAuthModal">
              {{ landingInstructorsCta.lineLinkText }}
            </NuxtLink>
          </p>
          <div class="mt-6 flex justify-center">
            <PrimaryButton
              preset="landing"
              variant="primary"
              @click="openAuthModal"
            >
              {{ landingInstructorsCta.button.label }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" aria-labelledby="faq-heading" class="pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pb-28">
      <div class="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div class="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <header>
            <SectionTitle
              :title="landingFaqIntro.title"
              :description="landingFaqIntro.description"
              title-id="faq-heading"
              align="left"
            />
          </header>
          <div class="motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]">
            <Accordion :items="landingFaqItems" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
