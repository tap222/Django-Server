<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Bell, Menu, Search, CheckCheck } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useRole } from '~/composables/useRole'

const { toggle } = useAppLayoutSidebar()
const { setRole, isAdmin, isTeacher, isServer, isStudent } = useRole()

const search = ref('')
const isNotificationsOpen = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

const notifications = ref([
  {
    id: 1,
    title: 'New Lesson Request',
    description: 'A new lesson request has been submitted for Math Grade 10.',
    time: '5m ago',
    read: false,
    type: 'lesson',
  },
  {
    id: 2,
    title: 'Event Reminder',
    description: 'The weekly teacher meeting starts in 15 minutes.',
    time: '15m ago',
    read: false,
    type: 'event',
  },
  {
    id: 3,
    title: 'System Update',
    description: 'The dashboard will be under maintenance tonight at 12:00 AM.',
    time: '2h ago',
    read: true,
    type: 'system',
  },
  {
    id: 4,
    title: 'New Message',
    description: 'You have a new message from the administration regarding vacations.',
    time: '1d ago',
    read: true,
    type: 'message',
  },
])

const hasUnread = computed(() => notifications.value.some((n) => !n.read))

const homePath = computed(() => {
  if (isTeacher.value) return '/teacher/dashboard'
  if (isServer.value) return '/server/dashboard'
  if (isStudent.value) return '/student/dashboard'
  return '/admin/dashboard'
})

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
}

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}

const handleClickOutside = (event: MouseEvent) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
    isNotificationsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 sm:gap-4 sm:px-6"
  >
    <div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
      <button
        type="button"
        class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
        @click="toggle"
      >
        <Menu class="size-6" aria-hidden="true" />
      </button>

      <div class="relative h-10 w-full min-w-0 max-w-sm">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4"
          aria-hidden="true"
        />
        <input
          v-model="search"
          type="search"
          placeholder="Search..."
          class="h-10 w-full rounded-lg border border-gray-200 bg-white py-0 pl-9 pr-4 text-sm text-gray-900 outline-none transition-[box-shadow,border-color] placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 sm:pl-10 sm:pr-5"
        >
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2 sm:gap-5">
      <!-- ... (admin/teacher buttons) ... -->

      <!-- Notifications -->
      <div class="relative">
        <!-- Mobile: Link to Page -->
        <NuxtLink
          to="/notifications"
          class="relative inline-flex size-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 sm:hidden"
          aria-label="Notifications"
        >
          <Bell class="h-5 w-5" aria-hidden="true" />
          <span
            v-if="hasUnread"
            class="pointer-events-none absolute right-2.5 top-2.5 size-2 rounded-full bg-orange-500 ring-2 ring-white"
          />
        </NuxtLink>

        <!-- Desktop: Dropdown -->
        <div ref="notificationRef" class="hidden sm:block">
          <button
            type="button"
            class="relative inline-flex size-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
            aria-label="Notifications"
            @click="toggleNotifications"
          >
            <Bell class="h-5 w-5" aria-hidden="true" />
            <span
              v-if="hasUnread"
              class="pointer-events-none absolute right-2.5 top-2.5 size-2 rounded-full bg-orange-500 ring-2 ring-white"
            />
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none"
            >
              <div class="flex items-center justify-between px-3 py-2">
                <h3 class="text-sm font-bold text-gray-900">Notifications</h3>
                <button
                  v-if="hasUnread"
                  type="button"
                  class="flex items-center gap-1.5 text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600"
                  @click="markAllAsRead"
                >
                  <CheckCheck class="size-3.5" />
                  <span class="whitespace-nowrap">Mark all as read</span>
                </button>
              </div>

              <div class="mt-1 space-y-1 max-h-[360px] overflow-y-auto px-1">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="group relative flex cursor-pointer gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50"
                  @click="notification.read = true"
                >
                  <div
                    :class="
                      cn(
                        'mt-1.5 size-2 shrink-0 rounded-full transition-colors',
                        notification.read ? 'bg-transparent' : 'bg-orange-500',
                      )
                    "
                  />
                  <div class="flex flex-1 flex-col gap-0.5">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-bold text-gray-900">{{ notification.title }}</span>
                      <span class="text-[10px] font-medium text-gray-400">{{ notification.time }}</span>
                    </div>
                    <p class="text-[11px] leading-relaxed text-gray-500 line-clamp-2">
                      {{ notification.description }}
                    </p>
                  </div>
                </div>

                <div v-if="notifications.length === 0" class="py-10 text-center">
                  <Bell class="mx-auto size-8 text-gray-200" />
                  <p class="mt-2 text-xs text-gray-500">No new notifications</p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>


      <NuxtLink
        :to="homePath"
        :class="
          cn(
            'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-orange-500 bg-white px-3 text-sm font-semibold text-orange-500 transition-colors sm:px-5',
            'hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200',
          )
        "
      >
        Home
      </NuxtLink>
    </div>
  </header>

</template>

