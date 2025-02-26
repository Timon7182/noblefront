<template>
    <div class="relative my-20">
      <!-- Title (Name of the Category) -->
      <h2 class="text-3xl lg:text-6xl  font-thin text-center md:ml-10 mb-5"
       v-html="title">
      </h2>
  
      <div class="w-full md:w-1/2 text-lg text-gray-700 px-5 md:px-10 mx-auto text-left" v-html="description"></div>
  
      <div class="flex flex-wrap justify-center gap-10 md:gap-20 py-5">
      <a
        v-for="category in categories"
        :key="category.id"
        :href="`/catalogue?categoryId=${category.id}`"
        class="w-auto flex items-center"
      >
        <img
          class="h-20 md:h-24 object-contain grayscale hover:grayscale-0 transition-all"
          :src="getImgUrl(category.image)"
          :alt="category.id"
        />
      </a>
    </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { getImgUrl } from "@/utils";
  
  export default defineComponent({
    methods: {
      getImgUrl,
    },
    props: {
      title: {
        required: true,
        type: String,
      },
      description: {
        required: true,
        type: String,
      },
      categories: {
        required: true,
        type: Array,
        default: () => [],
      },
    },
  });
  </script>
  