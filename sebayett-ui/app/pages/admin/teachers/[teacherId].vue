<script setup lang="ts">
definePageMeta({
  allowedRoles: ['admin'],
})

import { computed, ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import BackButton from '@/components/common/BackButton.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

type TeacherDetail = {
  id: string
  firstName: string
  lastName: string
  dob: string
  gender: string
  expertise: string
}

const MOCK_TEACHERS: Record<string, TeacherDetail> = {
  '5f7f43be-747a-4088-88bf-87d6524f998e': { id: '5f7f43be-747a-4088-88bf-87d6524f998e', firstName: 'Derrick', lastName: 'McMichael', dob: 'April 26, 1967', gender: 'Male', expertise: 'Math' },
  'f2d8a54f-9f7c-4f41-8ab7-3f0f8d0f4f9a': { id: 'f2d8a54f-9f7c-4f41-8ab7-3f0f8d0f4f9a', firstName: 'Achraf', lastName: 'Khadraoui', dob: 'Sept. 19, 2000', gender: 'Male', expertise: 'Cybersecurity' },
  '00fcb577-b1f8-4b7a-bf5b-2bdc64c2f7e0': { id: '00fcb577-b1f8-4b7a-bf5b-2bdc64c2f7e0', firstName: 'Liam', lastName: "O'Shea", dob: 'Jan. 30, 2006', gender: 'Other', expertise: 'I jork it hard' },
  'a12285fb-8fdc-42bd-b871-5918e90ad1f2': { id: 'a12285fb-8fdc-42bd-b871-5918e90ad1f2', firstName: 'Kajal', lastName: 'Patel', dob: 'March 7, 1992', gender: 'Female', expertise: 'Dev' },
}

const route = useRoute()

const detailRows: Array<{ label: string; key: keyof TeacherDetail }> = [
  { label: 'Teacher ID', key: 'id' },
  { label: 'First Name', key: 'firstName' },
  { label: 'Last Name', key: 'lastName' },
  { label: 'Date Of Birth', key: 'dob' },
  { label: 'Gender', key: 'gender' },
  { label: 'Expertise', key: 'expertise' },
]

const teacher = computed(() => {
  const raw = route.params.teacherId
  const teacherId = Array.isArray(raw) ? raw[0] : raw
  if (typeof teacherId !== 'string' || teacherId.length === 0) return null
  try {
    const decoded = decodeURIComponent(teacherId)
    return MOCK_TEACHERS[decoded] ?? null
  } catch {
    return MOCK_TEACHERS[teacherId] ?? null
  }
})

const showDeleteModal = ref(false)
const isDeleting = ref(false)

async function confirmDelete() {
  if (!teacher.value) return
  isDeleting.value = true
  try {
    // Swap for $fetch(`/api/teachers/${teacher.value.id}`, { method: 'DELETE' }) when the API exists
    console.log('Deleting teacher:', teacher.value.id)
    showDeleteModal.value = false
    navigateTo('/admin/teachers')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section>
    <template v-if="teacher">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
          Teacher: {{ teacher.firstName }} {{ teacher.lastName }}
        </h1>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
            @click="showDeleteModal = true"
          >
            <Trash2 class="size-4" aria-hidden="true" />
            Delete
          </button>
          <BackButton />
        </div>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div class="space-y-5">
          <div v-for="row in detailRows" :key="row.key" class="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-6">
            <p class="w-full shrink-0 text-md font-medium text-gray-500 sm:w-44">{{ row.label }}:</p>
            <p class="text-md font-semibold text-gray-900 sm:text-base">{{ teacher[row.key] }}</p>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        :is-open="showDeleteModal"
        title="Delete Teacher?"
        :message="`Are you sure you want to delete '${teacher.firstName} ${teacher.lastName}'?`"
        confirm-label="Delete Teacher"
        :loading="isDeleting"
        @close="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </template>

    <template v-else>
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Teacher not found</h1>
        <BackButton />
      </div>
      <p class="text-sm text-gray-600">No teacher matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
