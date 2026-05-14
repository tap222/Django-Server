<script setup lang="ts">
import { cn } from '@/lib/utils'

const { brand, footerDescription, companyLinks, quickLinks, socialLinks } =
  usePublicSiteNav()

const year = new Date().getFullYear()

/** Matches sebayett_footer_v3.html */
const footerSurface = 'bg-[#1c1c1c]'
const linkClass =
  'block text-sm text-[#c0bfbd] transition-colors duration-150 hover:text-orange-500 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40'

const headingClass =
  'font-sans text-base font-semibold text-white mb-5'

const socialBtnClass =
  'inline-flex size-[38px] shrink-0 items-center justify-center rounded-full text-[#c0bfbd] transition-[color,background-color] duration-150 hover:bg-orange-500/10 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40'
</script>

<template>
  <footer :class="cn('mt-auto font-sans text-[#c0bfbd]', footerSurface)">
    <div class="mx-auto max-w-7xl px-4 pb-10 pt-16 md:px-6">
      <div class="border-b border-gray-700 pb-12">
        <div class="flex flex-col md:flex-row">
          <!-- Brand — wider column, large gap before link columns -->
          <div
            class="mb-12 shrink-0 md:mb-0 md:mr-16 md:w-2/5 md:pr-8"
          >
            <NuxtLink
              :to="brand.homePath"
              class="mb-5 block text-6xl font-bold tracking-tight text-orange-500 transition-opacity hover:opacity-90 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40"
            >
              {{ brand.title }}
            </NuxtLink>
            <p class="max-w-sm text-sm leading-relaxed text-gray-400">
              {{ footerDescription }}
            </p>
          </div>

          <!-- Company | Quick Links | Stay In Touch -->
          <div class="flex flex-1 flex-col gap-8 sm:flex-row">
            <div class="flex-1">
              <h4 :class="headingClass">
                Company
              </h4>
              <ul class="space-y-3">
                <li v-for="item in companyLinks" :key="item.to">
                  <NuxtLink :to="item.to" :class="linkClass">
                    {{ item.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="flex-1">
              <h4 :class="headingClass">
                Quick Links
              </h4>
              <ul class="space-y-3">
                <li v-for="item in quickLinks" :key="item.to">
                  <NuxtLink :to="item.to" :class="linkClass">
                    {{ item.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="flex-1">
              <h4 :class="headingClass">
                Stay In Touch
              </h4>
              <div class="flex items-center gap-2">
                <a
                  v-for="social in socialLinks"
                  :key="social.href + social.icon"
                  :href="social.href"
                  rel="noopener noreferrer"
                  target="_blank"
                  :aria-label="social.label"
                  :class="socialBtnClass"
                >
                  <!-- X -->
                  <svg
                    v-if="social.icon === 'x'"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.174 2.25h6.907l4.258 5.625zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                  <!-- Instagram -->
                  <svg
                    v-else-if="social.icon === 'instagram'"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <!-- Facebook -->
                  <svg
                    v-else-if="social.icon === 'facebook'"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    />
                  </svg>
                  <!-- YouTube (play triangle punched with footer bg) -->
                  <svg
                    v-else-if="social.icon === 'youtube'"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"
                    />
                    <polygon
                      points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                      fill="#1c1c1c"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 text-center text-sm text-gray-500">
        © {{ year }} All rights reserved.
      </div>
    </div>
  </footer>
</template>
