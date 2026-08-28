<template>
  <div class="relative p-5 lg:p-0 pb-24 lg:pb-0">
    <div class="flex items-center justify-between mb-6 lg:mb-8">
      <h2 class="text-[11px] uppercase tracking-[0.3em] text-ink">{{ $t('filters') }}</h2>
      <button type="button" class="lg:hidden" :aria-label="$t('filters')" @click="$emit('closeModal')">
        <XMarkIcon class="h-5" />
      </button>
    </div>

    <div class="border-t border-line pt-6">
      <h3 class="text-[11px] uppercase tracking-[0.2em] text-ink2 mb-4">{{ $t('price') }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="block text-xs text-ink2 mb-1.5">{{ $t('min_price') }}</span>
          <span class="relative block">
            <input
              v-model="filters.price.min"
              type="number"
              inputmode="numeric"
              min="0"
              class="field-input text-sm py-1.5 pr-6"
              placeholder="0"
            />
            <span class="absolute right-0 bottom-2 text-sm text-ink3 pointer-events-none">₸</span>
          </span>
        </label>
        <label class="block">
          <span class="block text-xs text-ink2 mb-1.5">{{ $t('max_price') }}</span>
          <span class="relative block">
            <input
              v-model="filters.price.max"
              type="number"
              inputmode="numeric"
              min="0"
              class="field-input text-sm py-1.5 pr-6"
              placeholder="0"
            />
            <span class="absolute right-0 bottom-2 text-sm text-ink3 pointer-events-none">₸</span>
          </span>
        </label>
      </div>
    </div>

    <div class="border-t border-line mt-8 pt-6">
      <h3 class="text-[11px] uppercase tracking-[0.2em] text-ink2 mb-4">{{ $t('brands') }}</h3>
      <input
        v-model="brands_query"
        type="text"
        class="field-input text-sm py-1.5"
        :placeholder="$t('start_typing')"
      />
      <div class="quiet-scroll h-56 lg:h-72 overflow-y-auto mt-5 pr-1 flex flex-col">
        <label
          v-for="brand in Object.values(filters.brands)"
          :key="brand.id"
          class="flex items-center gap-3 py-2 cursor-pointer text-sm text-ink2 hover:text-ink transition-colors"
        >
          <input
            type="radio"
            :value="brand.id"
            v-model="filters.selectedBrand"
            class="w-3.5 h-3.5 border-line text-ink focus:ring-0 focus:ring-offset-0"
          />
          {{ brand.name }}
        </label>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 p-5 bg-bg border-t border-line lg:static lg:p-0 lg:border-0 lg:mt-8">
      <button type="button" class="btn-solid w-full" @click="applyFilters()">
        {{ $t('apply') }}
      </button>
    </div>
  </div>
</template>


<script>
import { defineComponent, reactive } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline/index.js'

export default defineComponent({
  name: 'Filter',
  components: {
    XMarkIcon
  },
  props: {
    brands: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      filters: {
        discount: false,
        price: {
          min: 0,
          max: 0
        },
        brands: {},
        selectedBrand: null
      },
      brands_query: ''
    }
  },
  watch: {
    // Бренды приходят из store асинхронно — перезаполняем список, когда доедут
    brands() {
      this.setBrands(this.filterByQuery())
    },
    brands_query() {
      this.setBrands(this.filterByQuery())
    }
  },
  mounted() {
    this.setBrands(this.brands)
    window.addEventListener('resize', this.updateIsMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIsMobile)
  },
  methods: {
    filterByQuery() {
      const all = this.brands || []
      const q = this.brands_query.trim().toLowerCase()
      if (!q) return all
      return all.filter((el) => (el.name || '').toLowerCase().includes(q))
    },
    applyFilters() {
      let query = this.$route.query

      if (this.filters.selectedBrand) {
        query.brandId = this.filters.selectedBrand
      }

      if (this.filters.price.min) {
        query.minPrice = this.filters.price.min
      }

      if (this.filters.price.max) {
        query.maxPrice = this.filters.price.max
      }

      query.page = 1

      this.$emit('applyFilters', query)

      // Close modal if on mobile
      if (this.isMobile) {
        this.$emit('closeModal')
      }
    },
    setBrands(brands) {
      const updatedBrands = {}
      if (!brands) {
        this.filters.brands = reactive(updatedBrands)
        return
      }

      for (let i = 0; i < brands.length; i++) {
        updatedBrands[brands[i].id] = {
          selected: false,
          ...brands[i]
        }
      }

      this.filters.brands = reactive(updatedBrands)
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 768
    }
  }
})
</script>
