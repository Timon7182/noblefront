<template>
  <div class="bg-white p-4 rounded-md shadow-2xl w-full h-full lg:h-auto pb-16 lg:pb-4"> <!-- Adjust height and add bottom padding -->
    <button type="button" dir="rtl" class="absolute top-0 start-0" v-on:click="$emit('closeModal')">
      <XMarkIcon class="h-7 mt-1.5 mr-1" />
    </button>
    <h2 class="text-2xl uppercase text-center mb-4">{{ $t('filters') }}</h2>
    <hr class="font-bold" />
    <div class="mt-5">
      <h3 class="font-thin mb-2">{{ $t('price') }}</h3>
      <div class="grid grid-cols-2 gap-2">
  <fwb-input class="rounded text-lg" style="font-size: 16px;" v-model="filters.price.min" type="number"
    :label="$t('min_price')" :placeholder="filters.price.min" size="lg" />
  <fwb-input class="rounded text-lg" style="font-size: 16px;" v-model="filters.price.max" type="number"
    :label="$t('max_price')" :placeholder="filters.price.max" size="lg" />
</div>

    </div>
    <div class="mt-5">
      <h3 class="font-thin mb-2">{{ $t('brands') }}</h3>
      <fwb-input v-model="brands_query" :label="$t('search_brands')" :placeholder="$t('start_typing')" size="lg" />
      <div class="h-48 lg:h-64 overflow-y-auto mt-5"> <!-- Reduced height for mobile -->
        <fwb-radio v-for="brand in Object.values(filters.brands)" :key="brand.id" :value="brand.id"
          v-model="filters.selectedBrand">
          {{ brand.name }}
        </fwb-radio>
      </div>
    </div>
    <PrimaryBtn class="p-3 w-full uppercase font-semibold mt-3 fixed bottom-0 left-0 lg:relative lg:mt-3"
      @click="applyFilters()">
      {{ $t('apply') }}
    </PrimaryBtn>
  </div>
</template>


<script>
import { defineComponent, reactive } from 'vue'
import { FwbRadio, FwbInput } from 'flowbite-vue'
import { XMarkIcon } from '@heroicons/vue/24/solid/index.js'
import PrimaryBtn from '@/components/PrimaryBtn.vue'

export default defineComponent({
  name: 'Filter',
  components: {
    XMarkIcon,
    FwbRadio,
    FwbInput,
    PrimaryBtn
  },
  props: {
    brands: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768, // Set initial value based on screen width
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
    brands_query(val) {
      let brandsFiltered = this.brands
      if (val) {
        brandsFiltered = brandsFiltered.filter((el) => {
          return el.name.includes(val)
        })
      }

      this.setBrands(brandsFiltered)
    }
  },
  mounted() {
    this.setBrands(this.brands)
    window.addEventListener('resize', this.updateIsMobile) // Listen to window resize events
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateIsMobile) // Clean up on component unmount
  },
  methods: {
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

      for (let i = 0; i < brands.length; i++) {
        updatedBrands[brands[i].id] = {
          selected: false,
          ...brands[i]
        }
      }

      this.filters.brands = reactive(updatedBrands)
    },
    updateIsMobile() {
      // Update `isMobile` based on screen width
      this.isMobile = window.innerWidth <= 768
    }
  }
})
</script>
