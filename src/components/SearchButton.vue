<template>
  <form class="flex items-end gap-3 border-b border-ink pb-2 max-w-[520px] mx-auto w-full" @submit.prevent="applyFilters">
    <input
      v-model="searchQuery"
      type="text"
      name="search"
      id="search"
      class="block w-full border-0 bg-transparent p-0 text-ink placeholder:text-ink2 focus:ring-0 text-sm"
      :placeholder="$t('search')"
    />
    <button type="submit" :aria-label="$t('search')" class="shrink-0 text-[11px] uppercase tracking-[0.3em] text-ink hover:text-clay transition-colors inline-flex items-center gap-2">
      <MagnifyingGlassIcon class="h-4" />
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const searchQuery = ref('');

const applyFilters = () => {
  const query = {};

  if (searchQuery.value) {
    query.search = searchQuery.value;
  }

  query.page = 1;

  // Always navigate to `/catalogue` with the updated query
  router.push({ path: '/catalogue', query }).then(() => {
    // Refresh the page after updating the URL
    window.location.reload();
  });
};
</script>
