<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-ink-500/50 bg-ink-900">
    <div
      class="container-page flex flex-col items-center justify-between gap-2 py-8 text-sm text-slate-500 sm:flex-row"
    >
      <p>
        Built with Nuxt 3 · Data from
        <a
          href="https://jikan.moe"
          target="_blank"
          rel="noopener noreferrer"
          class="text-slate-400 underline-offset-2 transition hover:text-slate-200 hover:underline"
          >Jikan</a
        >
        (unofficial MyAnimeList API)
      </p>
      <p>&copy; {{ year }} · Work sample</p>
    </div>
  </footer>
</template>
