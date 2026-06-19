<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

function goHome() {
  // clearError navigates back into the app and resets the error boundary.
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ink-900">
    <AppHeader />
    <main class="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p class="text-6xl font-bold text-accent-soft">
        {{ error.statusCode || 'Error' }}
      </p>
      <h1 class="mt-4 text-2xl font-semibold text-slate-100">
        {{ error.statusCode === 404 ? 'Page not found' : 'Something broke' }}
      </h1>
      <p class="mt-2 max-w-md text-slate-400">
        {{
          error.statusCode === 404
            ? 'That page does not exist. Head back to discover some anime.'
            : 'An unexpected error occurred. Try heading home and starting again.'
        }}
      </p>
      <button
        type="button"
        class="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-ring focus-visible:ring-2"
        @click="goHome"
      >
        Back to home
      </button>
    </main>
    <AppFooter />
  </div>
</template>
