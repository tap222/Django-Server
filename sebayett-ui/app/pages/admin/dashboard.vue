<script setup lang="ts">
definePageMeta({
  allowedRoles: ['admin'],
})

import { computed, ref } from 'vue'
import { Dropdown } from '@/components/ui/dropdown'
import IncomeProgress from '@/components/dashboard/IncomeProgress.vue'
import MonthlyIncomeChart from '@/components/charts/MonthlyIncomeChart.vue'

const username = 'kajalps'

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
})

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last Month', 'This Year']
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          {{ greeting }}
        </h1>
        <p class="mt-1 text-xl font-normal leading-normal">
          Welcome back, {{ username }}
        </p>
      </div>

      <Dropdown
        v-model="selectedRange"
        :options="rangeOptions"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-4xl font-bold text-orange-500">22</p>
            <h2 class="mt-5 text-xl font-bold text-gray-900">Upcoming Events</h2>
            <span class="flex items-center text-xs mt-1 gap-1 text-gray-500">
              <p class="text-green-500">+0.5% </p><p class="font-medium text-gray-400">than last month</p>
            </span>
          </div>
          <div class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-orange-100">
            <img
              src="/images/dashboard-upcoming-event-icon.png"
              alt=""
              class="h-8 w-8 object-contain"
              aria-hidden="true"
            >
          </div>
        </div>
      </article>

      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-4xl font-bold text-orange-500">18</p>
            <h2 class="mt-5 text-xl font-bold text-gray-900">Active Lesson</h2>
            <span class="flex items-center text-xs mt-1 gap-1 text-gray-500">
              <p class="text-green-500">+0.5% </p><p class="font-medium text-gray-400">than last month</p>
            </span>          </div>
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-orange-100"
          >
            <img
                src="/images/dashboard-lesson-icon.png"
                alt=""
                class="h-8 w-8 object-contain"
                aria-hidden="true"
              >          </div>
        </div>
      </article>

      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-4xl font-bold text-orange-500">145</p>
            <h2 class="mt-5 text-xl font-bold text-gray-900">Events</h2>
            <span class="flex items-center text-xs text-gray-500 mt-1 gap-1">
              <p class="text-green-500">+0.5% </p><p class="font-medium text-gray-400">than last month</p>
            </span>          </div>
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-orange-100"
          >
            <img
                src="/images/dashboard-event-icon.png"
                alt=""
                class="h-8 w-8 object-contain"
                aria-hidden="true"
              >          </div>
        </div>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section
        class="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2"
        aria-labelledby="monthly-income-heading"
      >
        <h2 id="monthly-income-heading" class="text-lg font-bold text-gray-900">
          Monthly Income
        </h2>
        <div class="mt-4">
          <MonthlyIncomeChart />
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
          <IncomeProgress :value="80000" :change="-2" />
        </div>
      </section>
    </div>
  </div>
</template>
