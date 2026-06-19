<script setup lang="ts">
import type { Anime } from '~/types/jikan'

const props = defineProps<{ anime: Anime }>()

const { score, year } = useFormat()

// Prefer webp where the API offers it; fall back to jpg.
const cover = computed(
  () =>
    props.anime.images.webp?.large_image_url ||
    props.anime.images.webp?.image_url ||
    props.anime.images.jpg.large_image_url ||
    props.anime.images.jpg.image_url ||
    '',
)

const topGenres = computed(() => props.anime.genres.slice(0, 2))

const hasScore = computed(() => typeof props.anime.score === 'number')
</script>

<template>
  <NuxtLink
    :to="`/anime/${anime.mal_id}`"
    class="group flex flex-col overflow-hidden rounded-xl border border-ink-500/60 bg-ink-700 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow focus-visible:-translate-y-1 focus-visible:border-accent/60"
  >
    <div class="relative aspect-[2/3] w-full overflow-hidden bg-ink-600">
      <img
        v-if="cover"
        :src="cover"
        :alt="`Cover art for ${anime.title}`"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-xs text-slate-500"
        aria-hidden="true"
      >
        No image
      </div>

      <!-- Score badge -->
      <div
        v-if="hasScore"
        class="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-ink-900/85 px-1.5 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur"
      >
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.4l-5.8 3.05 1.1-6.47L2.6 9.35l6.5-.95L12 2.5z"
          />
        </svg>
        <span class="sr-only">Score</span>{{ score(anime.score) }}
      </div>

      <!-- Bottom gradient for legibility on overlapped content -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/80 to-transparent"
        aria-hidden="true"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 p-3">
      <h3
        class="line-clamp-2 text-sm font-semibold leading-snug text-slate-100 transition group-hover:text-accent-soft"
        :title="anime.title"
      >
        {{ anime.title }}
      </h3>

      <div class="mt-auto flex items-center gap-2 text-xs text-slate-400">
        <span>{{ year(anime) }}</span>
        <span v-if="anime.type" aria-hidden="true">·</span>
        <span v-if="anime.type">{{ anime.type }}</span>
      </div>

      <ul v-if="topGenres.length" class="flex flex-wrap gap-1.5">
        <li
          v-for="g in topGenres"
          :key="g.mal_id"
          class="rounded-full border border-ink-500/70 bg-ink-600/60 px-2 py-0.5 text-[11px] text-slate-300"
        >
          {{ g.name }}
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>
