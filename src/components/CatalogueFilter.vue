<template>
  <div>
    <template v-if="isOpen">
      <div class="fixed inset-0 z-modal-backdrop bg-ink/50 backdrop-blur-sm lg:hidden" @click.self="$emit('closeModal')">
        <div class="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-bg z-modal overflow-y-auto">
          <Filter :brands="brands" @closeModal="$emit('closeModal')" @applyFilters="(query) => $emit('applyFilters', query)"/>
        </div>
      </div>
    </template>
    <div class="hidden lg:block lg:w-64 xl:w-72">
      <Filter :brands="brands" @closeModal="$emit('closeModal')" @applyFilters="(query) => $emit('applyFilters', query)"/>
    </div>
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
