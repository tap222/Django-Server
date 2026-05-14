<script setup lang="ts">
import PublicFooter from '~/components/public/layout/PublicFooter.vue'
import PublicHeader from '~/components/public/layout/PublicHeader.vue'
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-public-surface">
    <PublicHeader />

    <main id="main-content" class="flex-1 px-3 pb-12 pt-6 sm:px-4 lg:px-6">
      <div class="mx-auto w-full max-w-7xl">
        <slot />
      </div>
    </main>

    <PublicFooter />
  </div>
</template>
