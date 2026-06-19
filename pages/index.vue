<script setup lang="ts">
import type { Anime, Genre } from '~/types/jikan'

/**
 * Discovery page.
 *
 * Two data sources:
 *  - genres (once, for the filter chips),
 *  - the anime listing, which is one of: the popular feed (/top/anime) when
 *    there is no query/genre, or a filtered search (/anime?q=&genres=).
 *
 * `useAsyncData` keys on the active query so navigating filters refetches,
 * while results are accumulated for "Load more" pagination. All four states
 * (loading / error / empty / loaded) are rendered explicitly.
 */

const { getTopAnime, searchAnime, getGenres } = useJikan()

// ---- Filter & search state ------------------------------------------------
const searchInput = ref('')
const debouncedSearch = useDebouncedRef(searchInput, 400)
const selectedGenre = ref<number | null>(null)
const page = ref(1)

// Reset to page 1 whenever the query or genre changes.
watch([debouncedSearch, selectedGenre], () => {
  page.value = 1
})

const trimmedQuery = computed(() => debouncedSearch.value.trim())
const isFiltering = computed(
  () => trimmedQuery.value.length > 0 || selectedGenre.value !== null,
)

// A stable key describing "what list are we looking at" (page excluded so the
// fetcher can read page.value directly for accumulation).
const listKey = computed(
  () => `list:${trimmedQuery.value}:${selectedGenre.value ?? 'all'}`,
)

// ---- Genres (filter chips) -----------------------------------------------
const {
  data: genreData,
  pending: genresPending,
  error: genresError,
  refresh: refreshGenres,
} = await useAsyncData<Genre[]>(
  'genres',
  async () => {
    const res = await getGenres()
    return res.data
  },
  { default: () => [] },
)

// ---- Listing --------------------------------------------------------------
const items = ref<Anime[]>([])
const hasNextPage = ref(false)
const loadingMore = ref(false)

const {
  pending,
  error,
  refresh,
} = await useAsyncData(
  listKey,
  async () => {
    const res = isFiltering.value
      ? await searchAnime({
          q: trimmedQuery.value || undefined,
          genres: selectedGenre.value ? String(selectedGenre.value) : undefined,
          page: page.value,
        })
      : await getTopAnime(page.value)

    hasNextPage.value = res.pagination.has_next_page

    // Page 1 replaces; subsequent pages append (Load more).
    if (page.value === 1) {
      items.value = res.data
    } else {
      // De-dupe in case Jikan returns overlap at page boundaries.
      const seen = new Set(items.value.map((a) => a.mal_id))
      items.value = [...items.value, ...res.data.filter((a) => !seen.has(a.mal_id))]
    }
    return res.data
  },
  // Refetch when the active list changes; `page` is watched separately below.
  { watch: [listKey] },
)

async function loadMore() {
  if (loadingMore.value || !hasNextPage.value) return
  loadingMore.value = true
  page.value += 1
  try {
    await refresh()
  } finally {
    loadingMore.value = false
  }
}

function retry() {
  page.value = 1
  refresh()
}

// Heading reflects the active context.
const heading = computed(() => {
  if (trimmedQuery.value) return `Results for “${trimmedQuery.value}”`
  if (selectedGenre.value) {
    const g = genreData.value.find((x) => x.mal_id === selectedGenre.value)
    return g ? `${g.name} anime` : 'Filtered anime'
  }
  return 'Popular anime'
})

// Show the full-grid skeleton only on the very first load of a list
// (page 1), not when appending more results.
const showInitialLoading = computed(
  () => pending.value && page.value === 1 && items.value.length === 0,
)
const showError = computed(() => !!error.value && items.value.length === 0)
const showEmpty = computed(
  () => !pending.value && !error.value && items.value.length === 0,
)

useHead({ title: 'Discover anime · Anime Explorer' })
</script>

<template>
  <div>
    <!-- Hero / intro -->
    <section class="border-b border-ink-500/40 bg-gradient-to-b from-ink-800 to-ink-900">
      <div class="container-page py-12 sm:py-16">
        <h1 class="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Discover anime
        </h1>
        <p class="mt-2 max-w-2xl text-slate-400">
          Browse the most popular titles, search by name, and filter by genre.
          Data comes straight from MyAnimeList via the Jikan API.
        </p>

        <div class="mt-6 max-w-xl">
          <SearchBar v-model="searchInput" />
        </div>
      </div>
    </section>

    <div class="container-page py-8">
      <!-- Genre filter -->
      <div class="mb-8">
        <ErrorState
          v-if="genresError"
          title="Couldn’t load genres"
          message="The genre list failed to load. The rest of the page still works."
          @retry="() => refreshGenres()"
        />
        <GenreFilter
          v-else
          v-model="selectedGenre"
          :genres="genreData"
          :loading="genresPending"
        />
      </div>

      <!-- Listing header -->
      <div class="mb-5 flex items-end justify-between gap-4">
        <h2 class="text-lg font-semibold text-slate-100">{{ heading }}</h2>
        <p v-if="items.length" class="text-sm text-slate-500">
          {{ items.length }} shown
        </p>
      </div>

      <!-- States -->
      <LoadingGrid v-if="showInitialLoading" :count="18" />

      <ErrorState v-else-if="showError" @retry="retry()" />

      <EmptyState
        v-else-if="showEmpty"
        :title="isFiltering ? 'No matches' : 'Nothing to show'"
        :message="
          isFiltering
            ? 'No anime matched your search and filters. Try a different title or genre.'
            : 'The popular feed came back empty — please try again.'
        "
      />

      <!-- Loaded grid -->
      <template v-else>
        <Transition name="fade" mode="out-in">
          <ul
            :key="listKey"
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          >
            <li v-for="anime in items" :key="anime.mal_id">
              <AnimeCard :anime="anime" />
            </li>
          </ul>
        </Transition>

        <!-- Load more -->
        <div class="mt-10 flex justify-center">
          <button
            v-if="hasNextPage"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-ink-500/70 bg-ink-700 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-accent/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <svg
              v-if="loadingMore"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
            {{ loadingMore ? 'Loading…' : 'Load more' }}
          </button>
          <p v-else-if="items.length" class="text-sm text-slate-500">
            You’ve reached the end.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
