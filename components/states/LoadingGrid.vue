<script setup lang="ts">
/** Skeleton placeholder grid shown while the listing loads. */
withDefaults(defineProps<{ count?: number }>(), { count: 12 })
</script>

<template>
  <div
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    aria-hidden="true"
  >
    <div
      v-for="n in count"
      :key="n"
      class="overflow-hidden rounded-xl border border-ink-500/60 bg-ink-700"
    >
      <div class="skeleton aspect-[2/3] w-full" />
      <div class="space-y-2 p-3">
        <div class="skeleton h-3 w-3/4 rounded" />
        <div class="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  </div>
</template>
