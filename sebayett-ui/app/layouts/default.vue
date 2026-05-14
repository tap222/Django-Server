<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

const { navItems } = useSidebarMenus()
const { isTeacher, isServer, isStudent } = useRole()
const homeTo = computed(() => {
  if (isTeacher.value) return '/teacher/dashboard'
  if (isServer.value) return '/server/dashboard'
  if (isStudent.value) return '/student/dashboard'
  return '/admin/dashboard'
})

const { isOpen, close } = useAppLayoutSidebar()
const route = useRoute()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => route.fullPath,
  () => {
    close()
  },
)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <div
      v-show="isOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      aria-hidden="true"
      @click="close"
    ></div>

    <LayoutSidebar :items="navItems" :home-to="homeTo" />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <LayoutNavbar />

      <main class="flex-1 overflow-y-auto bg-[#F7F6F2] p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
