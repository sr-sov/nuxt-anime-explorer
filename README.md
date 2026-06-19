# Anime Explorer

A small anime-discovery app: browse the most popular titles, search by name,
filter by genre, and open a full detail page for any title. Data comes from the
[Jikan API](https://jikan.moe) (the unofficial MyAnimeList REST API), fetched
client-side so the whole thing deploys as a static site.

**Live:** https://sr-sov.github.io/nuxt-anime-explorer/

## Stack

- **Nuxt 3** (Vue 3, `<script setup>` + Composition API)
- **TypeScript** in `strict` mode, with typed API response interfaces
- **TailwindCSS** via `@nuxtjs/tailwindcss`
- **Jikan API v4** — no key, no auth

## Nuxt 3 patterns demonstrated

- **File-based routing** — `pages/index.vue` and the dynamic
  `pages/anime/[id].vue`.
- **Composables** — `composables/useJikan.ts` is a typed client over the four
  Jikan endpoints with a small in-memory cache and a client-side request-rate
  guard (Jikan allows ~3 req/s); `useDebounce.ts` debounces the search input
  (400 ms); `useFormat.ts` centralises presentation helpers.
- **Typed `useAsyncData`** — every page loads through `useAsyncData` keyed on
  the active query so changing the search or genre refetches cleanly, with
  "Load more" pagination accumulating results.
- **Explicit component states** — loading (skeletons), empty (no results),
  error (with retry), and loaded are each rendered deliberately. The shared
  state components live in `components/states/`.
- **Typed interfaces** — `types/jikan.ts` models only the fields actually
  consumed, with honest `null`/optional fields that match real API responses.
- **Accessibility** — semantic HTML, `alt` text, keyboard-navigable controls,
  a visible focus ring, `aria-pressed` filter chips, and `prefers-reduced-motion`
  handling.

## Project structure

```
types/jikan.ts                 Typed Jikan v4 interfaces
composables/
  useJikan.ts                  Typed fetchers + cache + rate guard
  useDebounce.ts               Debounced ref for the search box
  useFormat.ts                 Score / year / count formatting
components/
  AnimeCard.vue
  SearchBar.vue
  GenreFilter.vue
  AppHeader.vue
  AppFooter.vue
  states/{LoadingGrid,EmptyState,ErrorState}.vue
pages/
  index.vue                    Discovery: feed + search + genre filter
  anime/[id].vue               Detail page
app.vue · error.vue            Shell + error boundary
nuxt.config.ts · tailwind.config.ts
```

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run typecheck    # vue-tsc / nuxi typecheck (strict)
npm run generate     # static build -> .output/public
```

## Deploy (GitHub Pages)

Configured for a GitHub Pages **project page**, so `app.baseURL` is
`/nuxt-anime-explorer/` and Nitro uses the `github-pages` preset (which emits
`.nojekyll` and a `404.html` SPA fallback). `npm run generate` produces a
ready-to-publish `.output/public`.

## Going further

A few deliberate next steps that show the path beyond a static demo:

- **Nitro server-route proxy** — add `server/api/anime/[...].ts` to proxy Jikan
  server-side. That moves rate-limiting and caching off the client, hides the
  upstream, and enables **full SSR** for the listing and detail pages (better
  first paint and shareable, crawlable detail pages). It's a small change: swap
  the composable's `$fetch` base to the internal route and drop `ssr: false`
  concerns entirely.
- **Favorites** — a Supabase-backed favorites list (auth + a `favorites` table)
  would turn this from read-only discovery into a personal watchlist; the
  composable seam is already the right place to add it.

---

Data and imagery © MyAnimeList, served via Jikan. This is a portfolio work
sample, not affiliated with either.
