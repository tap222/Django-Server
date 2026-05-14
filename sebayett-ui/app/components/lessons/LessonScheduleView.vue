<script lang="ts">
interface ScheduleItem {
  day: string
  enabled: boolean
  startTime: string
  endTime: string
}

const mockSchedule: ScheduleItem[] = [
  { day: 'Monday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Tuesday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Thursday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' },
  { day: 'Friday', enabled: true, startTime: '09:00 AM', endTime: '10:30 AM' }
]

export type { ScheduleItem }
export { mockSchedule }
</script>

<script setup lang="ts">
interface Props {
  schedule?: ScheduleItem[]
}

const props = withDefaults(defineProps<Props>(), {
  schedule: () => mockSchedule
})
</script>

<template>
  <div>
    <div class="overflow-hidden rounded-lg border border-gray-200">
      <table class="w-full border-collapse">
        <thead class="border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200">
              Day Of The Week
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200">
              Start Time
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-500">
              End Time
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="item in props.schedule" :key="item.day" class="border-b border-gray-200">
            <td class="px-4 py-3 text-sm font-medium text-center text-black border-r border-gray-200">
              {{ item.day }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-center text-black border-r border-gray-200">
              {{ item.enabled ? item.startTime : '----' }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-center text-black">
              {{ item.enabled ? item.endTime : '----' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
