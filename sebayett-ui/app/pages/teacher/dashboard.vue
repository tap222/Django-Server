<script setup lang="ts">
definePageMeta({ allowedRoles: ['teacher'] })

import { computed } from 'vue'
import { Dropdown } from '@/components/ui/dropdown'
import StatCard from '@/components/dashboard/teacher/StatCard.vue'
import BarChart from '@/components/dashboard/teacher/BarChart.vue'
import IncomeProgress from '@/components/dashboard/IncomeProgress.vue'
import DataTable from '@/components/dashboard/teacher/DataTable.vue'
import { fetchTeacherDashboard } from '@/data/teacher-dashboard'

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last Month', 'This Year']

const { data, status } = await useAsyncData('teacher-dashboard', () => fetchTeacherDashboard())

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
})

const statCards = computed(() => [
  {
    value: data.value?.stats.totalStudents ?? 0,
    title: 'Total Students',
    percentageChange: data.value?.stats.totalStudentsChange ?? 0,
    iconSrc: '/images/dashboard-total-students.png',
  },
  {
    value: data.value?.stats.totalEvents ?? 0,
    title: 'Events',
    percentageChange: data.value?.stats.totalEventsChange ?? 0,
    iconSrc: '/images/dashboard-event-icon.png',
  },
  {
    value: data.value?.stats.totalLessons ?? 0,
    title: 'Total Lessons',
    percentageChange: data.value?.stats.totalLessonsChange ?? 0,
    iconSrc: '/images/dashboard-lesson-icon.png',
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
        <section class="rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="monthly-lessons-heading">
          <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="monthly-lessons-heading" class="text-lg font-bold text-gray-900">
              Monthly Lessons
            </h2>
            <span class="text-sm font-medium text-gray-600">{{ data.monthlyLessonsTotal }} Lessons</span>
          </div>
          <div class="mt-4">
            <BarChart :values="data.monthlyLessons" />
          </div>
        </section>

        <section
          class="flex min-h-[320px] flex-col rounded-2xl bg-white p-6 shadow-sm sm:min-h-[340px]"
          aria-labelledby="income-month-heading"
        >
          <h2 id="income-month-heading" class="shrink-0 text-lg font-bold text-gray-900">
            Income This Month
          </h2>
          <div class="flex flex-1 flex-col items-center justify-center">
            <IncomeProgress
              :value="data.incomeThisMonth"
              :percentage="data.incomeThisMonthPercentage"
              :change="data.incomeThisMonthChange"
            />
          </div>
        </section>
      </div>

      <!-- Table Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Upcoming Events"
          :rows="data.upcomingEvents"
          footer-text="+10 more events"
          view-more-to="/teacher/events"
        />
        <DataTable
          title="Lessons"
          :rows="data.lessons"
          footer-text="+10 more lessons"
          view-more-to="/teacher/lessons"
        />
      </div>
    </template>
  </div>
</template>


