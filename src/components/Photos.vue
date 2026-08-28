<template>
  <section class="my-24 md:my-36 text-center">
    <div class="max-w-page mx-auto px-5 xl:px-8">
      <h2
        v-reveal
        class="serif font-light text-[clamp(28px,3.4vw,48px)] leading-[1.1] [text-wrap:balance] mb-12 md:mb-16"
        v-html="title"
      ></h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 max-w-5xl mx-auto">
        <div
          v-for="(photo, idx) in sortedPhotos"
          :key="photo.id"
          v-reveal="(idx % 3) + 1"
          class="flex flex-col items-center text-center"
        >
          <img
            class="w-[88px] h-[88px] object-contain"
            :src="getImgUrl(photo.image)"
            :alt="photo.description"
          />
          <p class="text-[15px] leading-relaxed text-ink2 mt-5 max-w-[32ch]" v-html="photo.description"></p>
        </div>
      </div>
    </div>
  </section>
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
