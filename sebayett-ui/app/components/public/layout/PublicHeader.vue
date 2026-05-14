<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { PublicNavItem } from '~/config/public-site.config'
import AuthModal from '~/components/auth/AuthModal.vue'
import LogoutConfirmModal from '~/components/auth/LogoutConfirmModal.vue'
import PublicButton from '~/components/public/buttons/PublicButton.vue'
import { LANDING_CTA_HEADER_PRIMARY_CLASSES } from '~/config/landingCtaButton'
import PublicNavLink from '~/components/public/navigation/PublicNavLink.vue'

const props = withDefaults(
  defineProps<{
    /** Floating sticky header within the public layout */
    sticky?: boolean
    /** When set, replaces default main nav from composable */
    navItems?: PublicNavItem[]
    actionMode?: 'dashboard' | 'signInOnly' | 'loggedIn'
    barShape?: 'rounded-2xl' | 'rounded-full'
    tone?: 'onDark' | 'onLight'
    /** offset: floating bar (top gap); flush: gradient flush with viewport top */
    placement?: 'offset' | 'flush'
  }>(),
  {
    sticky: true,
    actionMode: 'dashboard',
    barShape: 'rounded-2xl',
    tone: 'onDark',
    placement: 'offset',
  },
)

const mobileMenuId = 'public-primary-navigation-mobile'
const mobileOpen = ref(false)
const logoutModalOpen = ref(false)

const { authModalOpen, openAuthModal: openAuthModalShared } = useAuthModal()

const {
  brand,
  mainNav,
  isLoggedIn,
  dashboardTo,
  signOut,
} = usePublicSiteNav()

const resolvedNav = computed(() => props.navItems ?? mainNav)

const shellClass = computed(() =>
  cn(
    'overflow-hidden bg-white p-1',
    props.barShape === 'rounded-full' ? 'rounded-lg' : 'rounded-2xl',
  ),
)

const logoRingOffset = computed(() => {
  if (props.placement === 'flush' && props.tone === 'onLight') {
    return 'focus-visible:ring-offset-transparent'
  }
  if (props.tone === 'onLight') {
    return 'focus-visible:ring-offset-white'
  }
  return 'focus-visible:ring-offset-[#121212]'
})

const outerShellClass = computed(() =>
  cn(
    'px-3 sm:px-4 lg:px-6',
    props.sticky &&
      (props.placement === 'flush'
        ? 'sticky top-0 z-50 pt-3 sm:pt-4'
        : 'sticky top-4 z-50 pt-4'),
  ),
)

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function openAuthModal() {
  openAuthModalShared()
  mobileOpen.value = false
}

function openLogoutModal() {
  logoutModalOpen.value = true
  mobileOpen.value = false
}

function onDiscordSignIn() {
  // TODO: wire Discord OAuth when available
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    mobileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header>
    <div :class="outerShellClass">
      <div class="mx-auto w-full max-w-7xl">
        <div :class="shellClass">
          <div class="flex h-16 items-center gap-4 px-3 sm:px-4 lg:px-6">
            <NuxtLink
              :to="brand.homePath"
              :class="
                cn(
                  'shrink-0 text-xl font-bold tracking-tight text-brand transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 sm:text-3xl lg:text-4xl rounded-full px-0.5',
                  logoRingOffset,
                )
              "
            >
              {{ brand.title }}
            </NuxtLink>

            <nav
              class="hidden flex-1 justify-center gap-6 xl:gap-8 lg:flex"
              aria-label="Primary"
            >
              <PublicNavLink
                v-for="item in resolvedNav"
                :key="item.to + item.label"
                :to="item.to"
                :label="item.label"
              />
            </nav>

            <div
              v-if="actionMode === 'dashboard'"
              class="hidden shrink-0 items-center gap-3 lg:flex"
            >
              <PublicButton
                v-if="isLoggedIn"
                variant="outline"
                @click="openLogoutModal"
              >
                Log out
              </PublicButton>
              <PublicButton
                v-else
                variant="outline"
                @click="openAuthModal"
              >
                Sign in
              </PublicButton>
              <PublicButton variant="solid" :to="dashboardTo">
                Dashboard
              </PublicButton>
            </div>

            <div
              v-else-if="actionMode === 'loggedIn'"
              class="hidden shrink-0 items-center gap-3 lg:flex"
            >
              <PublicButton variant="outline" @click="openLogoutModal">
                Log out
              </PublicButton>
              <PublicButton variant="solid" :to="dashboardTo">
                Dashboard
              </PublicButton>
            </div>

            <div
              v-else
              class="hidden shrink-0 items-center gap-3 lg:flex"
            >
              <PublicButton
                variant="solid"
                :class="LANDING_CTA_HEADER_PRIMARY_CLASSES"
                @click="openAuthModal"
              >
                Sign In
              </PublicButton>
            </div>

            <div class="ml-auto flex items-center lg:ml-0 lg:hidden">
              <button
                type="button"
                class="inline-flex size-10 items-center justify-center rounded-xl text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                :aria-expanded="mobileOpen"
                :aria-controls="mobileMenuId"
                aria-label="Toggle menu"
                @click="toggleMobile"
              >
                <Menu v-if="!mobileOpen" class="size-6" aria-hidden="true" />
                <X v-else class="size-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            :id="mobileMenuId"
            class="overflow-hidden border-t border-neutral-100 transition-[max-height,opacity] duration-300 ease-out lg:hidden"
            :class="
              mobileOpen
                ? 'max-h-[min(80vh,28rem)] opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
            "
          >
            <nav
              class="flex flex-col gap-1 px-4 py-4 sm:px-6"
              aria-label="Primary mobile"
            >
              <PublicNavLink
                v-for="item in resolvedNav"
                :key="item.to + item.label"
                :to="item.to"
                :label="item.label"
                class="!px-0 py-2"
              />
              <div class="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4">
                <template v-if="actionMode === 'dashboard'">
                  <PublicButton
                    v-if="isLoggedIn"
                    class="w-full"
                    variant="outline"
                    @click="openLogoutModal"
                  >
                    Log out
                  </PublicButton>
                  <PublicButton
                    v-else
                    class="w-full"
                    variant="outline"
                    @click="openAuthModal"
                  >
                    Sign in
                  </PublicButton>
                  <PublicButton class="w-full" variant="solid" :to="dashboardTo">
                    Dashboard
                  </PublicButton>
                </template>
                <template v-else-if="actionMode === 'loggedIn'">
                  <PublicButton
                    class="w-full"
                    variant="outline"
                    @click="openLogoutModal"
                  >
                    Log out
                  </PublicButton>
                  <PublicButton class="w-full" variant="solid" :to="dashboardTo">
                    Dashboard
                  </PublicButton>
                </template>
                <PublicButton
                  v-else
                  :class="cn('w-full', LANDING_CTA_HEADER_PRIMARY_CLASSES)"
                  variant="solid"
                  @click="openAuthModal"
                >
                  Sign In
                </PublicButton>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <AuthModal v-model="authModalOpen" @discord-sign-in="onDiscordSignIn" />
    <LogoutConfirmModal v-model="logoutModalOpen" />
  </header>
</template>
