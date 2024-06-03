<template>
  <div class="w-full">
    <div class="relative shadow-sm mx-4 mt-3">
      <input
          type="text"
          name="search"
          id="search"
          class="block w-full border-0 pr-24 text-gray-900 placeholder:text-gray-400 border-b-2 focus:border-2 focus:border-gray-950 sm:text-sm sm:leading-6"
          :placeholder="$t('search')"
      />
      <div class="absolute inset-y-0 right-0 flex items-center bg-gray-950 p-3">
        <button class="">
          <MagnifyingGlassIcon class="h-4 text-white"/>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {MagnifyingGlassIcon} from "@heroicons/vue/24/solid";
</script>