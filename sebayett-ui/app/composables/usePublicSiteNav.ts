import { computed } from 'vue'
import {
  publicBrand,
  publicCompanyLinks,
  publicFooterDescription,
  publicMainNav,
  publicQuickLinks,
  publicSocialLinks,
} from '~/config/public-site.config'

/**
 * Public marketing nav + footer data and auth-aware dashboard / sign-out helpers.
 * Active route matching: exact path after normalizing trailing slashes (except root).
 */
export function usePublicSiteNav() {
  const authStore = useAuthStore()
  const { isTeacher, isServer, isStudent } = useRole()
  const route = useRoute()

  const isLoggedIn = computed(() => authStore.isLoggedIn)

  const dashboardTo = computed(() => {
    if (!authStore.isLoggedIn) {
      return '/login'
    }
    if (isTeacher.value) return '/teacher/dashboard'
    if (isServer.value) return '/server/dashboard'
    if (isStudent.value) return '/student/dashboard'
    return '/admin/dashboard'
  })

  const currentPath = computed(() => route.path.replace(/\/$/, '') || '/')
  const currentHash = computed(() => route.hash)

  function isActiveNavPath(path: string): boolean {
    const hashIdx = path.indexOf('#')
    if (hashIdx !== -1) {
      const pathPart = path.slice(0, hashIdx).replace(/\/$/, '') || '/'
      const hashPart = path.slice(hashIdx)
      if (pathPart !== currentPath.value) return false
      return currentHash.value === hashPart
    }
    const target = path.replace(/\/$/, '') || '/'
    if (target === '/' && currentPath.value === '/') {
      return !currentHash.value || currentHash.value === ''
    }
    return currentPath.value === target
  }

  async function signOut() {
    await authStore.logout()
    await navigateTo('/login')
  }

  return {
    brand: publicBrand,
    mainNav: publicMainNav,
    companyLinks: publicCompanyLinks,
    quickLinks: publicQuickLinks,
    socialLinks: publicSocialLinks,
    footerDescription: publicFooterDescription,
    isLoggedIn,
    dashboardTo,
    signOut,
    isActiveNavPath,
  }
}
