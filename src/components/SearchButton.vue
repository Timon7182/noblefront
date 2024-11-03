<template>
  <div class="w-full">
    <div class="relative shadow-sm mx-4 mt-3">
      <input
        v-model="searchQuery"
        type="text"
        name="search"
        id="search"
        class="block w-full border-0 pr-24 text-gray-900 placeholder:text-gray-400 border-b-2 focus:border-2 focus:border-gray-950 sm:text-sm sm:leading-6"
        :placeholder="$t('search')"
        @keyup.enter="applyFilters"
      />
      <div class="absolute inset-y-0 right-0 flex items-center bg-gray-950 p-3">
        <button @click="applyFilters">
          <MagnifyingGlassIcon class="h-4 text-white"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();
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

