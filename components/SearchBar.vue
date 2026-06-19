<script setup lang="ts">
/**
 * Controlled search input with a clear button. Debouncing lives in the parent
 * (via useDebouncedRef) so this component stays presentational and the parent
 * owns when a request actually fires.
 */
const model = defineModel<string>({ default: '' })

const inputEl = ref<HTMLInputElement | null>(null)

function clear() {
  model.value = ''
  inputEl.value?.focus()
}
</script>

<template>
  <div class="relative w-full">
    <label for="anime-search" class="sr-only">Search anime by title</label>
    <span
      class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500"
      aria-hidden="true"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="7" />
        <path stroke-linecap="round" d="m21 21-4.3-4.3" />
      </svg>
    </span>

    <input
      id="anime-search"
      ref="inputEl"
      v-model="model"
      type="search"
      autocomplete="off"
      enterkeyhint="search"
      placeholder="Search anime — e.g. Frieren, Cowboy Bebop…"
      class="w-full rounded-xl border border-ink-500/70 bg-ink-700 py-3 pl-11 pr-11 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-accent/60"
    />

    <button
      v-if="model"
      type="button"
      class="absolute inset-y-0 right-2.5 my-auto flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-ink-500/60 hover:text-slate-200"
      aria-label="Clear search"
      @click="clear"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  </div>
</template>
