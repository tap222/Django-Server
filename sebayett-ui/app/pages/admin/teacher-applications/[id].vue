<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import BackButton from '@/components/common/BackButton.vue'
import { teacherApplicationService } from '@/services/teacherApplicationService'
import type { TeacherApplicationDetail } from '@/services/teacherApplicationService'

const route = useRoute()
const rawId = route.params.id
const id = Array.isArray(rawId) ? rawId[0] : rawId
const decodedId = (() => { try { return decodeURIComponent(id) } catch { return id } })()

const { data } = await useAsyncData(`teacher-app-${decodedId}`, () => teacherApplicationService.getById(decodedId))
const application = data.value as TeacherApplicationDetail | null

const detailRows: Array<{ label: string; key: keyof TeacherApplicationDetail }> = [
  { label: 'First Name', key: 'firstName' },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Gender', key: 'gender' },
  { label: 'Date Of Birth', key: 'dob' },
  { label: 'Expertise', key: 'expertise' },
  { label: 'Application ID', key: 'applicationId' },
]

function onAccept() { teacherApplicationService.accept(decodedId) }
function onReject() { teacherApplicationService.reject(decodedId) }
</script>

<template>
  <section>
    <template v-if="application">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
          Application for Teacher: {{ application.firstName }} {{ application.lastName }}
        </h1>
        <BackButton />
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div class="space-y-5">
          <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
            <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
            <p class="text-md font-semibold text-gray-900 sm:text-base">{{ application[row.key] }}</p>
          </div>
        </div>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" class="inline-flex w-[25%] items-center justify-center rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" @click="onAccept">Accept</button>
          <button type="button" class="inline-flex w-[25%] items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700" @click="onReject">Reject</button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Application not found</h1>
        <BackButton />
      </div>
      <p class="text-sm text-gray-600">No application matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
