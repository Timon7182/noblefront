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
  components: { 
    CategoryTreeItem 
  }, 
  props: { 
    categories: { 
      type: Array, 
      required: true 
    } 
  }, 
  data() { 
    return { 
      openCategory: null, // Track which category is open 
    } 
  }, 
  methods: { 
    toggleCategory(categoryId) { 
      // If the same category is clicked, close it. Otherwise, open the new category. 
      this.openCategory = this.openCategory === categoryId ? null : categoryId; 
    } 
  } 
}) 
</script> 
 
<style scoped> 
/* Add any additional styling here */ 
</style>