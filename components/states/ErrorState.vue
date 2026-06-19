<script setup lang="ts">
/**
 * Error state with a retry affordance. Emits `retry` so the parent can
 * re-run its useAsyncData `refresh()` (or any recovery action).
 */
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Something went wrong',
    message:
      'We could not reach the anime database. This is often a temporary rate limit or network blip.',
  },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5 px-6 py-16 text-center"
    role="alert"
  >
    <svg
      class="mb-4 h-12 w-12 text-red-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 17h.01" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z"
      />
    </svg>
    <h2 class="text-lg font-semibold text-slate-100">{{ title }}</h2>
    <p class="mt-1 max-w-sm text-sm text-slate-400">{{ message }}</p>
    <button
      type="button"
      class="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-ring focus-visible:ring-2"
      @click="emit('retry')"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v5h5" />
      </svg>
      Try again
    </button>
  </div>
</template>
