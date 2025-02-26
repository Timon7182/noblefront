<template>
    <div class="w-full flex flex-col items-center text-center px-5 my-20 relative">
    
      <!-- Title (Centered) -->
      <h2 
        v-if="title" 
        class="text-3xl lg:text-6xl font-thin text-center mb-5 relative z-10"
        v-html="title"
      ></h2>
  
      <!-- Description (Centered Block, Left-Aligned Text) -->
      <div class="w-full md:w-1/2 text-lg text-gray-700 text-left relative z-10" v-html="description"></div>
    </div>
  </template>
  

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
  },
});
</script>
