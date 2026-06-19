<script setup lang="ts">
// Root layout shell. The page content animates between routes with a fade.
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ink-900">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
