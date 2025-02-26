<template>
    <div class="relative w-full">
      <!-- Main Image --> 
      <img class="w-full h-[400px] md:h-[600px] object-cover items-center justify-center " :src="getImgUrl(mainImage)" alt="Main Image" />
  
      <!-- Background Box Covering Only the Title -->
      <div class="absolute inset-0 flex items-center justify-center">
        <h2 
  class="text-lg sm:text-xl md:text-3xl lg:text-4xl font-thin   px-6 py-4 "
  :style="{ backgroundColor: formattedBackColor, padding: '16px 32px' }"
  v-html="title"
></h2>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { getImgUrl } from "@/utils";
  
  export default defineComponent({
    props: {
      title: {
        required: true,
        type: String,
      },
      backColor: {
        required: false,
        type: String,
        default: "#000000", // Default black background
      },
      mainImage: {
        required: true,
        type: String,
      },
    },
    computed: {
        formattedBackColor() {
    // Convert HEX to RGBA with transparency (0.8 opacity)
    const hex = this.backColor.startsWith("#") ? this.backColor.slice(1) : this.backColor;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.6)`; // 0.8 = 80% opacity
  }
    },
    methods: {
      getImgUrl,
    },
  });
  </script>
  