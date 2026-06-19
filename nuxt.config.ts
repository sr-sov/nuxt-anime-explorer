// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  // The app is deployed as a GitHub Pages *project* page, served from
  // a sub-path. baseURL keeps generated asset/route URLs correct.
  app: {
    baseURL: '/nuxt-anime-explorer/',
    head: {
      htmlAttrs: { lang: 'en', class: 'dark' },
      title: 'Anime Explorer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Discover and search anime — powered by the Jikan (MyAnimeList) API. A Nuxt 3 work sample.',
        },
        { name: 'theme-color', content: '#0a0a0f' },
      ],
      // Icons live in public/ and ship to the GitHub Pages sub-path. The hrefs
      // are baseURL-prefixed so they resolve correctly under /nuxt-anime-explorer/.
      // The .ico is listed first as the legacy fallback; modern browsers pick the
      // SVG. This also stops the browser's implicit /favicon.ico request (a 404
      // on the live console before this was added).
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/nuxt-anime-explorer/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt-anime-explorer/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/nuxt-anime-explorer/apple-touch-icon.png' },
      ],
    },
  },

  // GitHub Pages preset: emits .nojekyll and a 404.html SPA fallback,
  // so a fully static deploy works on a project sub-path.
  nitro: {
    preset: 'github-pages',
    prerender: {
      // Pre-render only the shell. Detail routes resolve client-side via the
      // 404.html SPA fallback, so the build never depends on Jikan being up
      // (and we don't burn build-time requests against its rate limit).
      crawlLinks: false,
      routes: ['/'],
      failOnError: false,
    },
  },

  // Data is fetched client-side from Jikan (see composables/useJikan.ts), so
  // no server runtime is required at deploy time. The shell is pre-rendered
  // for a fast first paint; dynamic detail routes are served by the SPA
  // fallback and hydrate against the live API.
  ssr: false,

  typescript: {
    strict: true,
    typeCheck: false, // run explicitly via `npm run typecheck`
  },

  runtimeConfig: {
    public: {
      jikanBase: 'https://api.jikan.moe/v4',
    },
  },
})
