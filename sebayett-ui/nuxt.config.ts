// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Syne:wght@700;800&display=swap',
        },
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Avoid Chrome "Unable to add filesystem: <illegal path>" when rootDir is a
  // WSL/Linux path or UNC while DevTools runs on Windows (workspace mismatch).
  experimental: {
    chromeDevtoolsProjectSettings: false,
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  runtimeConfig: {
    public: {
      /** Demo: admin | teacher | server | student */
      mockUserRole: 'admin',
      /** Canonical / OG base URL (override per deployment) */
      siteUrl: 'https://sebayett.com',
      apiBase: 'http://127.0.0.1:8000/'
    },
  },
  css: ['~/assets/tailwind.css'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
})
