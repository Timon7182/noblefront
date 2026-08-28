<template>
  <div class="max-w-page mx-auto px-5 xl:px-8 pt-10 md:pt-14 pb-20">
    <h1 class="serif font-light text-[clamp(32px,4.4vw,60px)] leading-[1.05] mb-10 md:mb-14">
      {{ $t('brands') }}
    </h1>

    <!-- Алфавит -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-4 mb-12 md:mb-16">
      <button
        class="text-xs uppercase tracking-[0.15em] transition-colors"
        :class="selected === null ? 'text-ink border-b border-ink' : 'text-ink2 hover:text-ink'"
        @click="selected = null"
      >
        {{ $t('all') }}
      </button>

      <button
        v-for="letter in alphabet"
        :key="letter"
        :disabled="!lettersWithBrands.includes(letter)"
        class="text-xs tracking-[0.15em] transition-colors"
        :class="[
          lettersWithBrands.includes(letter)
            ? (selected === letter ? 'text-ink border-b border-ink' : 'text-ink2 hover:text-ink')
            : 'text-ink3/50 cursor-not-allowed'
        ]"
        @click="selected = letter"
      >
        {{ letter }}
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
      <div v-for="letter in displayedLetters" :key="letter">
        <h2 class="serif text-2xl md:text-3xl font-light mb-4 pb-3 border-b border-line">{{ letter }}</h2>
        <ul class="flex flex-col gap-2.5">
          <li v-for="b in groupedBrands[letter]" :key="b.id">
            <router-link
              :to="{ path: '/catalogue', query: { categoryId: b.id } }"
              class="text-[15px] text-ink2 hover:text-ink transition-colors"
            >
              {{ b.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
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
  