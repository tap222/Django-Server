<script setup lang="ts">
import type { UserRole } from '~/types/auth'
import { USER_ROLES } from '~/types/auth'
import { createMockAuthUser } from '~/services/auth/mock-auth.repository'

definePageMeta({
  public: true,
})

const route = useRoute()
const authStore = useAuthStore()
const { setRole } = useRole()

async function signInAs(role: UserRole) {
  authStore.setUser(createMockAuthUser(role))
  if (role === 'admin' || role === 'teacher') {
    setRole(role)
  }
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await navigateTo(redirect)
}

function signOut() {
  authStore.clearSession()
}
</script>

<template>
  <div class="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-6 px-4 py-12">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Sign in (mock)</h1>
      <p class="mt-2 text-sm text-gray-600">
        RBAC demo: pick a role. Replace with API auth later via <code class="rounded bg-gray-100 px-1">createAuthRepository</code>.
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Sign in as role</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="role in USER_ROLES"
          :key="role"
          type="button"
          class="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
          @click="signInAs(role)"
        >
          {{ role }}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="text-sm text-gray-600 underline hover:text-gray-900"
      @click="signOut"
    >
      Clear session (stay on this page)
    </button>
  </div>
</template>
