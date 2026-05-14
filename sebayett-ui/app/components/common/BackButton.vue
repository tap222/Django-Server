<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'Back',
})

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <button
    type="button"
    class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
    @click="goBack"
  >
    {{ label }}
  </button>
</template>
