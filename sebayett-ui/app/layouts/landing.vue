<script setup lang="ts">
import PublicFooter from '~/components/public/layout/PublicFooter.vue'
import PublicHeader from '~/components/public/layout/PublicHeader.vue'
</script>

<template>
  <div
    class="flex min-h-dvh flex-col bg-figma-gradient text-neutral-900"
  >
    <PublicHeader
      action-mode="signInOnly"
      bar-shape="rounded-full"
      tone="onLight"
      placement="flush"
    />

    <main id="main-content" class="w-full flex-1">
      <slot />
    </main>

    <PublicFooter />
  </div>
</template>
