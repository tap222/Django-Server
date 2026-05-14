<script setup lang="ts">
import { computed } from 'vue'
import type { NavItem } from '~/config/navigation'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    items?: NavItem[]
    /** Logo link target (layout sets teacher vs admin home without role logic here). */
    homeTo?: string
  }>(),
  { items: undefined, homeTo: '/' },
)

const route = useRoute()
const { isOpen, close } = useAppLayoutSidebar()

const navItems = computed(() => props.items ?? [])

function isActive(to: string) {
  if (to === '/') {
    return route.path === '/'
  }
  if (route.path === to) {
    return true
  }

  // Special case: Student Dashboard remains active when viewing event details
  if (to === '/student/dashboard' && route.path.startsWith('/student/events/')) {
    return true
  }

  if (route.path.startsWith(`${to}/`)) {
    // Only return true if no other nav item is a more specific match
    const hasMoreSpecificMatch = navItems.value.some(item => 
      item.to !== to && 
      item.to.startsWith(to) && 
      (route.path === item.to || route.path.startsWith(`${item.to}/`))
    )
    return !hasMoreSpecificMatch
  }
  return false
}

function onNavigate() {
  close()
}
</script>

<template>
  <aside
    :class="
      cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )
    "
    aria-label="Main navigation"
  >
    <div class="flex items-center px-6 py-5">
      <NuxtLink
        :to="homeTo"
        class="text-4xl font-bold text-orange-500 transition-opacity hover:opacity-90"
      >
        Sebayett
      </NuxtLink>
    </div>

    <nav class="flex-1 space-y-2 overflow-y-auto px-6 pt-4 pb-4">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="
          cn(
            'flex min-h-11 items-center gap-3 rounded-lg text-sm transition-colors duration-200',
            isActive(item.to)
              ? 'bg-orange-50 font-bold text-black'
              : 'font-normal text-gray-500 hover:bg-gray-50',
          )
        "
      >
        <span
          class="flex h-8 w-2 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <span
            v-if="isActive(item.to)"
            class="h-7 w-1.5 shrink-0 rounded-full bg-orange-500"
          />
        </span>
        <component
          :is="item.icon"
          class="h-5 w-5 shrink-0 text-orange-500"
          :stroke-width="isActive(item.to) ? 2.25 : 2"
          aria-hidden="true"
        />
        <span
          :class="
            cn(
              'font-semibold',
              isActive(item.to) ? 'text-black' : 'text-gray-500'
            )
          "
        >
          {{ item.label }}
        </span>      
      </NuxtLink>
    </nav>
  </aside>
</template>
