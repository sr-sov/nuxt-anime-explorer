<script setup lang="ts">
import type { Anime } from '~/types/jikan'

/**
 * Anime detail page. Fetches /anime/{id}/full client-side and renders the
 * full record with explicit loading / error / loaded states. (A missing id
 * surfaces through the error state via Jikan's 404.)
 */
const route = useRoute()
const id = computed(() => route.params.id as string)

const { getAnimeById } = useJikan()
const { score, year, compact, episodes } = useFormat()

const {
  data,
  pending,
  error,
  refresh,
} = await useAsyncData<Anime | null>(
  () => `anime:${id.value}`,
  async () => {
    const res = await getAnimeById(id.value)
    return res.data
  },
  { watch: [id], default: () => null },
)

const anime = computed(() => data.value)

const cover = computed(() => {
  const a = anime.value
  if (!a) return ''
  return (
    a.images.webp?.large_image_url ||
    a.images.jpg.large_image_url ||
    a.images.jpg.image_url ||
    ''
  )
})

const trailerUrl = computed(() => anime.value?.trailer?.url || null)
const trailerEmbed = computed(() => anime.value?.trailer?.embed_url || null)

const englishTitle = computed(() => {
  const a = anime.value
  if (!a?.title_english || a.title_english === a.title) return null
  return a.title_english
})

// Keep the document title in sync once data arrives.
watchEffect(() => {
  if (anime.value) {
    useHead({ title: `${anime.value.title} · Anime Explorer` })
  }
})

const statusTone = computed(() => {
  const s = anime.value?.status?.toLowerCase() ?? ''
  if (s.includes('airing') && !s.includes('finished')) {
    return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
  }
  if (s.includes('not yet')) {
    return 'border-amber-400/30 bg-amber-400/10 text-amber-300'
  }
  return 'border-slate-400/20 bg-slate-400/10 text-slate-300'
})
</script>

<template>
  <div class="container-page py-8">
    <NuxtLink
      to="/"
      class="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
      Back to discovery
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div class="skeleton aspect-[2/3] w-full max-w-[300px] rounded-xl" />
      <div class="space-y-4">
        <div class="skeleton h-8 w-2/3 rounded" />
        <div class="skeleton h-4 w-1/3 rounded" />
        <div class="mt-6 space-y-2">
          <div class="skeleton h-3 w-full rounded" />
          <div class="skeleton h-3 w-full rounded" />
          <div class="skeleton h-3 w-5/6 rounded" />
          <div class="skeleton h-3 w-4/6 rounded" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <ErrorState
      v-else-if="error || !anime"
      title="Couldn’t load this anime"
      message="We couldn’t fetch this title. It may not exist, or the API may be rate-limited right now."
      @retry="refresh()"
    />

    <!-- Loaded -->
    <article v-else class="grid gap-8 lg:grid-cols-[300px_1fr]">
      <!-- Poster column -->
      <div class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-ink-500/60 bg-ink-700 shadow-card">
          <img
            v-if="cover"
            :src="cover"
            :alt="`Cover art for ${anime.title}`"
            class="aspect-[2/3] w-full object-cover"
            decoding="async"
          />
        </div>

        <a
          :href="anime.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-ring focus-visible:ring-2"
        >
          View on MyAnimeList ↗
        </a>
        <a
          v-if="trailerUrl"
          :href="trailerUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex w-full items-center justify-center gap-2 rounded-lg border border-ink-500/70 bg-ink-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-accent/50 hover:text-white"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch trailer
        </a>
      </div>

      <!-- Details column -->
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          {{ anime.title }}
        </h1>
        <p v-if="englishTitle" class="mt-1 text-slate-400">{{ englishTitle }}</p>
        <p v-if="anime.title_japanese" class="text-sm text-slate-500">
          {{ anime.title_japanese }}
        </p>

        <!-- Stat row -->
        <dl class="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Score</dt>
            <dd class="mt-0.5 flex items-baseline gap-1 text-lg font-semibold text-amber-300">
              {{ score(anime.score) }}
              <span v-if="anime.scored_by" class="text-xs font-normal text-slate-500">
                ({{ compact(anime.scored_by) }} votes)
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Rank</dt>
            <dd class="mt-0.5 text-lg font-semibold text-slate-200">
              {{ anime.rank ? `#${anime.rank}` : '—' }}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Episodes</dt>
            <dd class="mt-0.5 text-lg font-semibold text-slate-200">
              {{ episodes(anime.episodes) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Year</dt>
            <dd class="mt-0.5 text-lg font-semibold text-slate-200">{{ year(anime) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Members</dt>
            <dd class="mt-0.5 text-lg font-semibold text-slate-200">
              {{ compact(anime.members) }}
            </dd>
          </div>
        </dl>

        <!-- Badges: status, type -->
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span
            v-if="anime.status"
            class="rounded-full border px-3 py-1 text-xs font-medium"
            :class="statusTone"
          >
            {{ anime.status }}
          </span>
          <span
            v-if="anime.type"
            class="rounded-full border border-ink-500/70 bg-ink-700 px-3 py-1 text-xs font-medium text-slate-300"
          >
            {{ anime.type }}
          </span>
          <span
            v-if="anime.rating"
            class="rounded-full border border-ink-500/70 bg-ink-700 px-3 py-1 text-xs font-medium text-slate-300"
          >
            {{ anime.rating }}
          </span>
        </div>

        <!-- Genres -->
        <div v-if="anime.genres.length" class="mt-6">
          <h2 class="text-xs uppercase tracking-wide text-slate-500">Genres</h2>
          <ul class="mt-2 flex flex-wrap gap-2">
            <li
              v-for="g in anime.genres"
              :key="g.mal_id"
              class="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent-soft"
            >
              {{ g.name }}
            </li>
          </ul>
        </div>

        <!-- Studios -->
        <div v-if="anime.studios.length" class="mt-5">
          <h2 class="text-xs uppercase tracking-wide text-slate-500">Studios</h2>
          <p class="mt-1.5 text-sm text-slate-300">
            {{ anime.studios.map((s) => s.name).join(', ') }}
          </p>
        </div>

        <!-- Synopsis -->
        <div class="mt-7">
          <h2 class="text-sm font-semibold text-slate-100">Synopsis</h2>
          <p class="mt-2 whitespace-pre-line leading-relaxed text-slate-300">
            {{ anime.synopsis || 'No synopsis available for this title.' }}
          </p>
        </div>

        <!-- Embedded trailer -->
        <div v-if="trailerEmbed" class="mt-8">
          <h2 class="text-sm font-semibold text-slate-100">Trailer</h2>
          <div
            class="mt-3 aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-ink-500/60 bg-ink-900"
          >
            <iframe
              :src="trailerEmbed"
              :title="`${anime.title} trailer`"
              class="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
