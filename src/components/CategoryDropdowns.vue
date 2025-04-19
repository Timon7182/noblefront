<template> 
  <div class="flex flex-nowrap items-center justify-between text-nowrap w-full 2xl:w-4/5"> 
    <category-tree-item 
      v-for="category in categories" 
      :key="category.id" 
      :category="category" 
      :is-open="openCategory === category.id" 
      @toggle="toggleCategory(category.id)" 
    /> 
  </div> 
</template> 
 
<script> 
import { defineComponent } from 'vue' 
import CategoryTreeItem from './CategoryTreeItem.vue' 
 
export default defineComponent({
  name: 'CategoryDropdowns',
  components: { CategoryTreeItem },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      openCategory: null
    }
  },
  methods: {
    toggleCategory(categoryId) {
      // Toggle the clicked category; close if same
      this.openCategory = this.openCategory === categoryId ? null : categoryId
    },
    handleClickOutside(event) {
      // If click originates inside the category bar or inside any dropdown menu, do nothing
      if (
        this.$el.contains(event.target) ||
        event.target.closest('.category-dropdown')
      ) {
        return
      }
      // Otherwise, close the open category
      this.openCategory = null
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
})
</script> 
 
<style scoped> 
/* Add any additional styling here */ 
</style>