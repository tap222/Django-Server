<script setup lang="ts">
import { useStatus } from '~/composables/useStatus'
import { eventService } from '~/services/eventService'
import BackButton from '~/components/common/BackButton.vue'

definePageMeta({ allowedRoles: ['server'] })

const route = useRoute()
const { getStatusColorClass, capitalize } = useStatus()

const eventId = String(route.params.id)
const { data: event } = await useAsyncData(`server-event-detail-${eventId}`, () => eventService.getById(eventId))

const detailRows = [
  { label: 'Event Server', key: 'server' },
  { label: 'Event Teacher', key: 'teacher' },
  { label: 'Event Title', key: 'title' },
  { label: 'Event Description', key: 'description' },
  { label: 'Event Date', key: 'date' },
  { label: 'Event Time', key: 'time' },
]

function onAccept() {
  console.log('Server Accept event:', eventId)
  navigateTo('/server/events')
}

function onReject() {
  console.log('Server Reject event:', eventId)
  navigateTo('/server/events')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="event">
      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Events: {{ event.title }}</h1>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2 text-sm font-medium text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
          @click="navigateTo('/server/events')"
        >
          Back
        </button>
      </div>

      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Details Section -->
          <div class="flex-1 space-y-6">
            <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
              <p class="w-full shrink-0 text-md font-medium text-gray-400 sm:w-44">{{ row.label }}:</p>
              <p class="text-md font-semibold text-gray-900 sm:text-base">
                {{ (event as any)[row.key] || 'Explore latest trends in artificial intelligence and real-world applications.' }}
              </p>
            </div>
            <!-- Action Buttons -->
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <template v-if="event.status === 'Accepted' || event.status === 'Confirmed'">
                <div class="inline-flex w-[240px] items-center justify-center rounded-lg bg-emerald-100 px-6 py-2.5 text-sm font-bold text-emerald-700">
                  Accepted
                </div>
              </template>
              <template v-else-if="event.status === 'Rejected' || event.status === 'Refused'">
                <div class="inline-flex w-[240px] items-center justify-center rounded-lg bg-red-100 px-6 py-2.5 text-sm font-bold text-red-700">
                  Rejected
                </div>
              </template>
              <template v-else>
                <button 
                  type="button" 
                  class="inline-flex w-[240px] items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  @click="onAccept"
                >
                  Accept
                </button>
                <button 
                  type="button" 
                  class="inline-flex w-[240px] items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  @click="onReject"
                >
                  Reject
                </button>
              </template>
            </div>
          </div>

          <!-- Image Section -->
          <div class="w-full lg:w-[480px] xl:w-[540px]">
            <div class="overflow-hidden rounded-xl">
              <img 
                :src="event.imageUrl" 
                :alt="event.title"
                class="h-[260px] w-full rounded-2xl object-cover shadow-md sm:h-[320px] lg:h-[320px] xl:h-[360px]"
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-[30px] font-bold leading-tight text-gray-900">Event not found</h1>
        <BackButton />
      </div>
      <div class="rounded-2xl bg-white p-8 shadow-sm">
        <p class="text-sm text-gray-600">No event matches this ID. Return to the list and try again.</p>
      </div>
    </template>
  </div>
</template>
