<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  public: true,
})

const config = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)

function loginWithDiscord() {
  // Redirect to Django discord OAuth endpoint
  // Django-allauth will handle the OAuth flow and redirect back
  // `next` sends the user back to this Nuxt app (not Django's own home page) after Discord
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  const next = encodeURIComponent(`${window.location.origin}${redirect}`)
  window.location.href = `${config.public.apiBase}accounts/discord/login/?process=login&next=${next}`
}

async function logout() {
  try {
    await authStore.logout()
    window.location.href = '/login'
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-6 px-4 py-12">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Sign in to Sebayett</h1>
      <p class="mt-2 text-sm text-gray-600">
        Authenticate with your Discord account
      </p>
    </div>

    <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <button
      type="button"
      :disabled="loading"
      class="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      @click="loginWithDiscord"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.211.375-.445.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.608-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106c-.653-.248-1.276-.561-1.876-.92a.077.077 0 00-.009-.128c.126-.094.252-.192.372-.291a.074.074 0 00.03-.066c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 00.033.065c.12.099.246.198.373.291a.077.077 0 00-.006.127c-.6.36-1.223.672-1.876.921a.076.076 0 00-.041.106c.352.699.765 1.364 1.226 1.994a.078.078 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.057c.5-4.716-.838-8.813-3.543-12.46a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.974-2.157 2.157-2.157c1.193 0 2.169.973 2.157 2.157c0 1.19-.974 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.974-2.157 2.157-2.157c1.193 0 2.169.973 2.157 2.157c0 1.19-.965 2.156-2.157 2.156z" />
      </svg>
      {{ loading ? 'Signing in...' : 'Sign in with Discord' }}
    </button>

    <div class="text-center">
      <button
        type="button"
        class="text-sm text-gray-600 underline hover:text-gray-900"
        @click="logout"
      >
        Or sign out
      </button>
    </div>
  </div>
</template>
