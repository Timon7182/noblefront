<template>
  <div>
    <template v-if="isOpen">
      <div class="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
        <Filter :brands="brands" @closeModal="$emit('closeModal')" @applyFilters="(query) => $emit('applyFilters', query)"/>
      </div>
    </template>
    <template v-else>
      <div class="hidden lg:block lg:w-72 lg:h-full lg:bg-gray-100 lg:flex lg:flex-col lg:left-0 lg:top-0">
        <Filter :brands="brands" @closeModal="$emit('closeModal')" @applyFilters="(query) => $emit('applyFilters', query)"/>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Filter from '@/components/Filter.vue'

export default defineComponent({
  components: {
    Filter
  },
  props: {
    brands: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  }
})
</script>