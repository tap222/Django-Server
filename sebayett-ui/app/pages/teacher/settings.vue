<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'

definePageMeta({
  allowedRoles: ['teacher'],
})
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'
import { Dropdown } from '@/components/ui/dropdown'

// API-ready reactive state
const settings = ref({
  timezone: "GMT+05:30 - Asia/Kolkata"
})

// Timezone options for SelectInput
const timezoneOptions = [
  "GMT+05:30 - Asia/Kolkata",
  "UTC-08:00 Pacific Time (PT)",
  "UTC-05:00 Eastern Time (ET)",
  "UTC+00:00 Greenwich Mean Time (GMT)",
  "UTC+01:00 Central European Time (CET)",
  "UTC+08:00 China Standard Time (CST)"
]

// Modal state management
const isDeleteModalOpen = ref(false)

function handleDeleteAccount() {
  // Placeholder for API integration
  console.info('delete account')
  isDeleteModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-[30px] font-bold leading-tight text-gray-900">Settings</h1>
    <!-- Settings Card -->
    <section class="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

      <div class="mt-2 space-y-6">
        <!-- Time Zone Row -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span class="w-full text-sm font-medium text-gray-900 sm:w-40">
            Select Time Zone:
          </span>
          <div class="w-full max-w-md">
            <Dropdown
              :modelValue="settings.timezone"
              :options="timezoneOptions"
              @update:modelValue="settings.timezone = $event"
              widthClass="w-full"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200" />

        <!-- Delete Account Row -->
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span class="w-full text-sm font-medium text-gray-900 sm:w-40">
            Delete Account
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            @click="isDeleteModalOpen = true"
          >
            <Trash2 class="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </section>

    <!-- Delete Account Modal -->
    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      title="Delete Account?"
      message="Are you sure you want to delete your account? This action cannot be undone."
      entityName=""
      confirmLabel="Delete Account"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteAccount"
    />
  </div>
</template>
