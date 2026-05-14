<script setup lang="ts">
definePageMeta({ allowedRoles: ['server'] })

import { computed, ref } from 'vue'
import { Dropdown } from '@/components/ui/dropdown'
import StatCard from '@/components/dashboard/teacher/StatCard.vue'
import BarChart from '@/components/dashboard/teacher/BarChart.vue'
import DataTable from '@/components/dashboard/teacher/DataTable.vue'
import { fetchServerDashboard } from '@/data/server-dashboard'

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last Month', 'This Year']

const { data, status } = await useAsyncData('server-dashboard', () => fetchServerDashboard())

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
})

const statCards = computed(() => [
  {
    value: data.value?.stats.upcomingEvents ?? 0,
    title: 'Upcoming Events',
    percentageChange: data.value?.stats.upcomingEventsChange ?? 0,
    iconSrc: '/images/dashboard-upcoming-event-icon.png',
  },
  {
    value: data.value?.stats.monthlyEvents ?? 0,
    title: 'Monthly Events',
    percentageChange: data.value?.stats.monthlyEventsChange ?? 0,
    iconSrc: '/images/dashboard-event-icon.png',
  },
  {
    value: data.value?.stats.income ? `$ ${data.value.stats.income.toLocaleString()}` : '$ 0',
    title: 'Income',
    percentageChange: data.value?.stats.incomeChange ?? 0,
    iconSrc: '/images/income-dollar-icon.png',
  },
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="status === 'pending'">
      <div class="flex h-64 items-center justify-center">
        <p class="text-sm text-gray-400">Loading...</p>
      </div>
    </template>

    <template v-else-if="!data">
      <div class="flex h-64 items-center justify-center">
        <p class="text-sm text-red-500">Failed to load dashboard data.</p>
      </div>
    </template>

    <template v-else>
      <!-- Header Section -->
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {{ greeting }}
          </h1>
          <p class="mt-1 text-xl font-normal leading-normal text-gray-600">
            Welcome back, {{ data.username }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <Dropdown v-model="selectedRange" :options="rangeOptions" />
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          v-for="card in statCards"
          :key="card.title"
          :value="card.value"
          :title="card.title"
          :percentage-change="card.percentageChange"
          :icon-src="card.iconSrc"
        />
      </div>

      <!-- Chart Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section class="rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="monthly-attendees-heading">
          <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="monthly-attendees-heading" class="text-lg font-bold text-gray-900">
              Monthly Event Attendees
            </h2>
            <span class="text-sm font-medium text-gray-600">{{ data.monthlyAttendeesTotal }} Event</span>
          </div>
          <div class="mt-10">
            <BarChart :values="data.monthlyAttendees" />
          </div>
        </section>

        <DataTable
          title="Events"
          :rows="data.upcomingEvents"
          footer-text="+10 more events"
          view-more-to="/server/events"
        />
      </div>
    </template>
  </div>
</template>
