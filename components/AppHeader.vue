<script setup lang="ts">
// Static, sticky header. Kept presentational; navigation is just the logo home.
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-ink-500/50 bg-ink-900/80 backdrop-blur supports-[backdrop-filter]:bg-ink-900/60"
  >
    <div class="container-page flex h-16 items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="group inline-flex items-center gap-2.5 rounded-lg"
        aria-label="Anime Explorer — home"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-fuchsia-600 text-white shadow-glow"
          aria-hidden="true"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4 8 8-4 8 4-8 4-8-4Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="m4 12 8 4 8-4" />
            <path stroke-linecap="round" stroke-linejoin="round" d="m4 16 8 4 8-4" />
          </svg>
        </span>
        <span class="text-base font-semibold tracking-tight text-slate-100">
          Anime<span class="text-accent-soft">Explorer</span>
        </span>
      </NuxtLink>

      <a
        href="https://docs.api.jikan.moe"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden text-sm text-slate-400 transition hover:text-slate-200 sm:inline"
      >
        Data by Jikan / MyAnimeList ↗
      </a>
    </div>
  </header>
</template>
