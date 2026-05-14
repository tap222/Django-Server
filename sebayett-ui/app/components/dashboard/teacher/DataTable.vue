<script setup lang="ts">
import { useStatus } from '~/composables/useStatus'

interface Row {
  id: string
  thumbnail: string
  title: string
  category: string
  status: string
}

interface Props {
  title: string
  rows: Row[]
  footerText?: string
  showViewMore?: boolean
  viewMoreTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  footerText: '+10 more events',
  showViewMore: true,
})

const { getStatusColorClass, capitalize } = useStatus()
</script>

<template>
  <section class="rounded-2xl bg-white p-6 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900">
      {{ title }}
    </h2>
    
    <div class="mt-4">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left text-sm font-medium text-gray-500 pb-3">Title</th>
              <th class="text-left text-sm font-medium text-gray-500 pb-3">Categories</th>
              <th class="text-left text-sm font-medium text-gray-500 pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="row in rows" 
              :key="row.id"
              class="border-b border-gray-100 last:border-b-0"
            >
              <td class="py-3">
                <div class="flex items-center gap-3">
                  <img 
                    :src="row.thumbnail" 
                    :alt="row.title"
                    class="h-10 w-16 shrink-0 rounded-md object-cover shadow-sm"
                  >
                  <span class="text-sm font-medium text-gray-900">{{ row.title }}</span>
                </div>
              </td>
              <td class="py-3">
                <span class="text-sm text-gray-600">{{ row.category }}</span>
              </td>
              <td class="py-3">
                <span 
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border',
                    getStatusColorClass(row.status)
                  ]"
                >
                  {{ capitalize(row.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm text-gray-500">{{ footerText }}</span>
      <NuxtLink
        v-if="showViewMore && viewMoreTo"
        :to="viewMoreTo"
        class="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
      >
        View more >
      </NuxtLink>
      <button
        v-else-if="showViewMore"
        class="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
      >
        View more >
      </button>
    </div>
  </section>
</template>
