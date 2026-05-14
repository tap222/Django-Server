<script setup lang="ts">
import Checkbox from '@/components/common/Checkbox.vue'
import TimePicker from '@/components/common/TimePicker.vue'

interface ScheduleItem {
  day: string
  enabled: boolean
  startTime: string
  endTime: string
}

interface Props {
  schedule: ScheduleItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [schedule: ScheduleItem[]]
}>()

function setDayEnabled(index: number, enabled: boolean) {
  const newSchedule = [...props.schedule]
  const item = newSchedule[index]
  if (!item || item.enabled === enabled) {
    return
  }

  item.enabled = enabled

  if (!enabled) {
    item.startTime = ''
    item.endTime = ''
  }

  emit('update', newSchedule)
}

function updateTime(index: number, field: 'startTime' | 'endTime', value: string) {
  const newSchedule = [...props.schedule]
  const item = newSchedule[index]
  if (item) {
    item[field] = value
  }
  emit('update', newSchedule)
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border-[0.5px] border-neutral-200">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px] border-collapse">
        <thead>
          <tr class="bg-white">
            <th
              class="w-20 border-[0.5px] border-neutral-200 px-4 py-3 text-center text-[13px] font-normal text-neutral-500"
            >
              Check
            </th>
            <th
              class="border-[0.5px] border-neutral-200 px-4 py-3 text-center text-[13px] font-normal text-neutral-500"
            >
              Day
            </th>
            <th
              class="border-[0.5px] border-neutral-200 px-4 py-3 text-center text-[13px] font-normal text-neutral-500"
            >
              Start Time
            </th>
            <th
              class="border-[0.5px] border-neutral-200 px-4 py-3 text-center text-[13px] font-normal text-neutral-500"
            >
              End Time
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(item, index) in schedule"
            :key="item.day"
            class="border-[0.5px] border-neutral-200 transition-colors hover:bg-neutral-100"
          >
            <td class="border-[0.5px] border-neutral-200 px-4 py-2.5 text-center align-middle">
              <div class="inline-flex justify-center">
                <Checkbox
                  :id="`lesson-schedule-${item.day}`"
                  :model-value="item.enabled"
                  :aria-label="`${item.day} schedule`"
                  @update:model-value="setDayEnabled(index, $event)"
                />
              </div>
            </td>
            <td
              class="border-[0.5px] border-neutral-200 px-4 py-2.5 text-center align-middle text-sm text-neutral-900"
            >
              {{ item.day }}
            </td>
            <td class="relative border-[0.5px] border-neutral-200 px-4 py-2.5 text-center align-middle">
              <TimePicker
                :model-value="item.startTime"
                :disabled="!item.enabled"
                @update:model-value="updateTime(index, 'startTime', $event)"
              />
            </td>
            <td class="relative border-[0.5px] border-neutral-200 px-4 py-2.5 text-center align-middle">
              <TimePicker
                :model-value="item.endTime"
                :disabled="!item.enabled"
                @update:model-value="updateTime(index, 'endTime', $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
