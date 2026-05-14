import type { Pinia } from 'pinia'
import type { DirectiveBinding } from 'vue'
import type { Permission } from '~/types/permission'

function applyCan(
  el: HTMLElement,
  binding: DirectiveBinding<Permission | Permission[] | undefined>,
  pinia: Pinia,
) {
  const authStore = useAuthStore(pinia)
  const value = binding.value
  if (value === undefined) {
    el.style.removeProperty('display')
    return
  }
  const mode = (binding.arg === 'all' ? 'all' : 'any') as 'all' | 'any'
  const allowed = authStore.hasPermission(value, mode)
  if (!allowed) {
    el.style.display = 'none'
  }
  else {
    el.style.removeProperty('display')
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('can', {
    mounted(el, binding) {
      applyCan(el, binding, nuxtApp.$pinia)
    },
    updated(el, binding) {
      applyCan(el, binding, nuxtApp.$pinia)
    },
  })
})
