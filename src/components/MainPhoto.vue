<template>
  <section class="relative overflow-hidden h-[62vh] min-h-[420px] max-h-[720px] my-24 md:my-36" data-parallax-frame>
    <img
      v-parallax="10"
      class="parallax-cover"
      :src="getImgUrl(mainImage)"
      :alt="plainTitle"
    />

    <!-- Тонирование в цвет из CMS + градиент снизу для читаемости заголовка -->
    <div class="absolute inset-0" :style="{ backgroundColor: tintColor }"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent"></div>

    <div class="absolute inset-x-0 bottom-[8%]">
      <div class="max-w-page mx-auto px-5 xl:px-8">
        <h2
          v-reveal
          class="serif font-light text-bg text-[clamp(26px,3.4vw,46px)] leading-[1.12] max-w-[20ch] [text-wrap:balance]"
          v-html="title"
        ></h2>
      </div>
    </div>
  </section>
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
      default: "#000000",
    },
    mainImage: {
      required: true,
      type: String,
    },
  },
  computed: {
    tintColor() {
      // Лёгкое тонирование цветом из CMS вместо плашки под заголовком
      const hex = this.backColor.startsWith("#") ? this.backColor.slice(1) : this.backColor;
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.18)`;
    },
    plainTitle() {
      return this.title.replace(/<[^>]*>/g, "");
    },
  },
  methods: {
    getImgUrl,
  },
});
</script>
