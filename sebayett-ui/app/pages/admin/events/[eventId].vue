<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin', 'teacher'] })

import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import ActionButton from '@/components/common/ActionButton.vue'
import BackButton from '@/components/common/BackButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { eventService } from '@/services/eventService'
import type { EventDetail } from '@/services/eventService'

const route = useRoute()
const rawParam = route.params.eventId
const eventId = decodeURIComponent(String(Array.isArray(rawParam) ? rawParam[0] : rawParam))

const { data } = await useAsyncData(`event-${eventId}`, () => eventService.getById(eventId))
const eventData = ref<EventDetail | null>(data.value as EventDetail | null)

const showDeleteModal = ref(false)
const isDeleting = ref(false)

async function confirmDelete() {
  if (!eventData.value) return
  isDeleting.value = true
  try {
    await eventService.deleteEvent(eventId)
    showDeleteModal.value = false
    navigateTo('/admin/events')
  } finally {
    isDeleting.value = false
  }
}

const detailRows = eventData.value ? [
  { label: 'Event Title', value: eventData.value.title },
  { label: 'Server', value: eventData.value.server },
  { label: 'Lesson', value: eventData.value.lesson },
  { label: 'Teacher', value: eventData.value.teacher },
  { label: 'Category', value: eventData.value.category },
  { label: 'Time', value: eventData.value.time },
  { label: 'Date', value: eventData.value.date },
  { label: 'Created at', value: eventData.value.createdAt },
] : []
</script>

<template>
  <section>
    <template v-if="eventData">
      <header class="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Event: {{ eventData.title }}</h1>
        <div class="flex items-center gap-3">
          <ActionButton label="Delete" variant="red" @click="showDeleteModal = true">
            <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
          </ActionButton>
          <BackButton />
        </div>
      </header>

      <div class="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0 flex-1 space-y-5">
            <div v-for="row in detailRows" :key="row.label" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
              <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
              <p class="text-md font-semibold text-gray-900 sm:text-base">{{ row.value }}</p>
            </div>
            <div class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
              <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">Status:</p>
              <div class="text-md font-semibold text-gray-900 sm:text-base">
                <StatusBadge :status="eventData.status" />
              </div>
            </div>
          </div>
          
          <div class="w-full lg:w-[480px] xl:w-[540px]">
            <img 
              v-if="eventData.imageUrl" 
              :src="eventData.imageUrl" 
              :alt="eventData.title" 
              class="h-[260px] w-full rounded-2xl object-cover shadow-md sm:h-[320px] lg:h-[320px] xl:h-[360px]" 
              loading="lazy"
            >
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Event?"
        :message="`Are you sure you want to delete '${eventData.title}'?`"
        :entity-name="eventData.title"
        confirm-label="Delete Event"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </template>

    <template v-else>
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Event not found</h1>
        <BackButton />
      </header>
      <p class="text-sm text-gray-600">No event matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
