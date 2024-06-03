<template>
  <div class="flex flex-nowrap items-center justify-between flex-nowrap text-nowrap w-full 2xl:w-4/5">
    <div v-for="category in categories" :key="category.name" class="relative rounded-xl m-1">
      <button @focus="toggleDropdown(category)" tabindex="0" class="text-left w-full uppercase">
        {{ category.name }}
      </button>
      <div
        v-if="dropdowns[category.name]"
        class="w-full mt-2 bg-white border border-gray-200 rounded shadow-lg uppercase"
      >
        <div class="absolute flex flex-col z-40 bg-white">
          <fwb-list-group-item>
            <template v-if="category.id">
              <a
                :href="`/catalogue?categoryId=${category.id}`"
                class="block p-2 hover:bg-gray-100"
                >{{ $t('all') }}</a
              >
            </template>
            <template v-else>
              <a href="/catalogue" class="block p-2 hover:bg-gray-100">{{ $t('all') }}</a>
            </template>
          </fwb-list-group-item>

          <fwb-list-group-item
            v-for="subCategory in category.subCategoryPojoList"
            :key="subCategory.id"
          >
            <template v-if="subCategory.id">
              <a
                :href="`/catalogue?categoryId=${subCategory.id}`"
                class="block p-2 hover:bg-gray-100"
                >{{ subCategory.name }}</a
              >
            </template>
            <template v-else>
              <a href="/catalogue" class="block p-2 hover:bg-gray-100">{{ subCategory.name }}</a>
            </template>
          </fwb-list-group-item>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { FwbListGroup, FwbListGroupItem } from 'flowbite-vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    FwbListGroup,
    FwbListGroupItem
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dropdowns: {},
      clickedOnDropdown: false
    }
  },
  methods: {
    toggleDropdown(category) {
      if (category.id) {
        window.location = `/catalogue?categoryId=${category.id}`
        return
      }

      if (Object.keys(this.dropdowns).length > 0) {
        this.dropdowns = {}
      }
      this.dropdowns[category.name] = !this.dropdowns[category.name]
    },
    closeDropdowns() {
      
      this.dropdowns = {}
    }
  }
})
</script>
  
  <style scoped>
/* Add any additional styling here */
</style>