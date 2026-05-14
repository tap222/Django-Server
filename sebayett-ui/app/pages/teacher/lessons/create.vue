<script setup lang="ts">
definePageMeta({
  allowedRoles: ['teacher'],
})

import BackButton from '@/components/common/BackButton.vue'
import LessonForm from '@/components/lessons/LessonForm.vue'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-[30px] font-bold text-gray-900">Here you can create a lesson</h1>
      <BackButton />
    </div>

    <!-- Form Container -->
    <div class="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <LessonForm />
    </div>
  </div>

</template>


