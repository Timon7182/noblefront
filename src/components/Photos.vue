<template>
  <div class="relative my-20 text-center">
    <!-- Title -->
    <h2 class="text-3xl lg:text-4xl font-thin text-center mb-10 " v-html="title"></h2>

    <!-- Centered Container at 80% Width -->
    <div class="w-4/5 mx-auto">
      <!-- Grid for Even Distribution -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          v-for="photo in sortedPhotos"
          :key="photo.id"
          class="flex flex-col items-center text-center"
        >
          <!-- Image (Fixed 100x100) -->
          <img
            class="w-[100px] h-[100px] object-contain"
            :src="getImgUrl(photo.image)"
            :alt="photo.description"
          />
          <!-- Description -->
          <p class="text-lg text-gray-700 mt-4" v-html="photo.description"></p>
        </div>
      </div>
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
    photos: {
      required: true,
      type: Array,
      default: () => [],
    },
  },
  computed: {
    // Sorting photos by order before displaying
    sortedPhotos() {
      return [...this.photos].sort((a, b) => a.order - b.order);
    },
  },
});
</script>
