<script setup lang="ts">
import type { LessonScheduleSlot } from '~/config/lessons.content'

withDefaults(
  defineProps<{
    rows: LessonScheduleSlot[]
    /** `book`: gray header row (Book Lesson page). */
    variant?: 'default' | 'book'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <div
    class="overflow-x-auto rounded-2xl border border-neutral-200 sm:overflow-hidden"
  >
    <table
      class="w-full min-w-[280px] border-collapse text-center text-sm text-neutral-800"
    >
      <caption class="sr-only">
        Lesson schedule
      </caption>
      <thead>
        <tr
          class="divide-x divide-neutral-200 border-b border-neutral-200 text-neutral-600"
          :class="variant === 'book' ? 'bg-neutral-100' : 'bg-transparent'"
        >
          <th
            scope="col"
            class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4"
          >
            Day Of The Week
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4"
          >
            Start Time
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4"
          >
            End Time
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-200 bg-white">
        <tr
          v-for="(row, idx) in rows"
          :key="`${row.day}-${idx}`"
          class="divide-x divide-neutral-200 transition-colors hover:bg-neutral-50/80"
        >
          <td class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4">
            {{ row.day }}
          </td>
          <td class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4">
            {{ row.start }}
          </td>
          <td class="px-3 py-3.5 text-sm font-semibold sm:px-4 sm:py-4">
            {{ row.end }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
