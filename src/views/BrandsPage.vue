<template>
    <div class="px-4 pt-6 grid grid-cols-12 gap-6">
      <!-- 1. Alphabet sidebar: moves to top on mobile, left on desktop -->
      <aside class="col-span-12 md:col-span-2 mt-4 md:mt-24 md:sticky md:top-0 bg-white p-4">
        <div class="grid grid-cols-6 gap-2 text-center overflow-x-auto">
          <!-- 'Все' button -->
          <button
            @click="selected = null"
            :class="selected === null
              ? 'py-1 font-bold underline'
              : 'py-1 text-gray-500 hover:text-gray-700'
            "
          >
            Все
          </button>
          
          <!-- Alphabet letters -->
          <button
            v-for="letter in alphabet"
            :key="letter"
            @click="lettersWithBrands.includes(letter) && (selected = letter)"
            :class="[
              'py-1',
              lettersWithBrands.includes(letter)
                ? (selected === letter
                    ? 'font-bold underline'
                    : 'text-gray-500 hover:text-gray-700')
                : 'text-gray-300 cursor-not-allowed'
            ]"
          >
            {{ letter }}
          </button>
        </div>
      </aside>
  
      <!-- 2. Brands / header: full width on mobile, right of alphabet on desktop -->
      <main class="col-span-12 md:col-span-8 flex flex-col items-center space-y-6">
        <h1 class="text-3xl font-semibold bg-white py-4 mb-4 text-center md:text-left">
          Бренды
        </h1>
        <div class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          <div v-for="letter in displayedLetters" :key="letter">
            <h2 class="text-xl md:text-2xl font-semibold mb-2">{{ letter }}</h2>
            <ul class="space-y-1">
              <li v-for="b in groupedBrands[letter]" :key="b.id">
                <router-link
                  :to="{ path: '/catalogue', query: { categoryId: b.id } }"
                  class="block p-2 hover:bg-gray-100 rounded"
                >
                  {{ b.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </main>
  
      <!-- 3. Calendar / other: full width on mobile, rightmost on desktop -->
      <aside class="col-span-12 md:col-span-2">
        <CalendarWidget />
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  // A–Z alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  // selected letter filter, null = all
  const selected = ref(null)
  
  onMounted(() => {
    store.dispatch('getCategories')
  })
  
  // grouped brands from Vuex getter
  const groupedBrands = computed(() => store.getters.groupedBrands || {})
  
  // letters that have at least one brand
  const lettersWithBrands = computed(() =>
    alphabet.filter(L => (groupedBrands.value[L] || []).length > 0)
  )
  
  // displayed letters: all or selected
  const displayedLetters = computed(() =>
    selected.value
      ? [selected.value].filter(L => lettersWithBrands.value.includes(L))
      : lettersWithBrands.value
  )
  </script>
  
  <style scoped>
  /* Styling via Tailwind in template */
  </style>
  