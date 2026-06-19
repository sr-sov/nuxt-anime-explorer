<script setup lang="ts">
/** Neutral empty state — e.g. a search with no matches. */
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Nothing here',
    message: 'No results matched your search. Try a different title or genre.',
  },
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-500/70 bg-ink-800/40 px-6 py-16 text-center"
    role="status"
  >
    <svg
      class="mb-4 h-12 w-12 text-slate-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path stroke-linecap="round" d="m21 21-4.3-4.3" />
    </svg>
    <h2 class="text-lg font-semibold text-slate-200">{{ title }}</h2>
    <p class="mt-1 max-w-sm text-sm text-slate-400">{{ message }}</p>
    <slot />
  </div>
</template>
