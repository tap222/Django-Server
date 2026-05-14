<script setup lang="ts">
import { Bell, CheckCheck, ArrowLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

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

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true))
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:hidden"
          @click="$router.back()"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>
      <button
        v-if="hasUnread"
        type="button"
        class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
        @click="markAllAsRead"
      >
        <CheckCheck class="size-4" />
        Mark all as read
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="group relative flex cursor-pointer gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-orange-100 hover:shadow-md"
        @click="notification.read = true"
      >
        <div
          :class="
            cn(
              'mt-2 size-2.5 shrink-0 rounded-full transition-colors',
              notification.read ? 'bg-transparent' : 'bg-orange-500',
            )
          "
        />
        <div class="flex flex-1 flex-col gap-1">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-gray-900">{{ notification.title }}</span>
            <span class="text-xs font-medium text-gray-400">{{ notification.time }}</span>
          </div>
          <p class="text-sm leading-relaxed text-gray-600">
            {{ notification.description }}
          </p>
        </div>
      </div>

      <div
        v-if="notifications.length === 0"
        class="rounded-2xl border border-dashed border-gray-200 py-20 text-center"
      >
        <Bell class="mx-auto size-12 text-gray-200" />
        <h3 class="mt-4 text-lg font-semibold text-gray-900">No notifications</h3>
        <p class="mt-2 text-gray-500">You're all caught up!</p>
      </div>
    </div>
  </div>
</template>
