<script setup lang="ts">
import type { Genre } from '~/types/jikan'

/**
 * Horizontal, scrollable genre chips. The selected genre id is a v-model so
 * the parent owns filter state. `null` = "All". Genres are fetched by the
 * parent and passed in, with loading/error handled there.
 */
const props = defineProps<{
  genres: Genre[]
  loading?: boolean
}>()

const selected = defineModel<number | null>({ default: null })

// Keep the chip rail focused: show the most-populated genres first.
const sorted = computed(() =>
  [...props.genres].sort((a, b) => b.count - a.count),
)

function select(id: number | null) {
  selected.value = id
}
</script>

<template>
  <div>
    <h2 class="sr-only">Filter by genre</h2>

    <!-- Loading: a few placeholder chips -->
    <div v-if="loading" class="flex gap-2 overflow-hidden" aria-hidden="true">
      <div v-for="n in 8" :key="n" class="skeleton h-8 w-20 shrink-0 rounded-full" />
    </div>

    <div
      v-else-if="genres.length"
      class="flex gap-2 overflow-x-auto pb-1"
      role="group"
      aria-label="Genre filter"
    >
      <button
        type="button"
        class="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
        :class="
          selected === null
            ? 'border-accent bg-accent text-white'
            : 'border-ink-500/70 bg-ink-700 text-slate-300 hover:border-accent/50 hover:text-slate-100'
        "
        :aria-pressed="selected === null"
        @click="select(null)"
      >
        All
      </button>

      <button
        v-for="g in sorted"
        :key="g.mal_id"
        type="button"
        class="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
        :class="
          selected === g.mal_id
            ? 'border-accent bg-accent text-white'
            : 'border-ink-500/70 bg-ink-700 text-slate-300 hover:border-accent/50 hover:text-slate-100'
        "
        :aria-pressed="selected === g.mal_id"
        @click="select(g.mal_id)"
      >
        {{ g.name }}
      </button>
    </div>
  </div>
</template>
