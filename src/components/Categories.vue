<template>
  <!-- Хроника домов: смена материала — плотная песочная глава между светлыми -->
  <section class="bg-surface border-y border-line my-24 md:my-36 py-20 md:py-28 overflow-hidden" data-parallax-frame>
    <div class="max-w-page mx-auto px-5 xl:px-8 text-center">
      <h2
        v-reveal
        class="serif font-light italic text-[clamp(24px,2.6vw,36px)] leading-[1.35] max-w-[38ch] mx-auto [text-wrap:balance] heritage-quote"
        v-html="title"
      ></h2>

      <div
        v-if="description"
        v-reveal="1"
        class="text-ink2 text-[15px] leading-relaxed max-w-prose mx-auto mt-6"
        v-html="description"
      ></div>

      <div
        v-parallax="{ x: 4 }"
        class="mt-14 md:mt-20 flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-20"
      >
        <a
          v-for="(category, idx) in categories"
          :key="category.id"
          v-reveal="(idx % 4)"
          :href="`/catalogue?categoryId=${category.id}`"
          class="block"
        >
          <img
            class="h-16 md:h-20 object-contain brand-logo"
            :src="getImgUrl(category.image)"
            :alt="category.name || `brand-${category.id}`"
          />
        </a>
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

<style scoped>
.heritage-quote::before {
  content: "« ";
  color: #B8896E;
}
.heritage-quote::after {
  content: " »";
  color: #B8896E;
}

/* Логотипы домов приходят из CMS в разных форматах — обесцвечиваем,
   умножение прячет белые подложки на песочном фоне. */
.brand-logo {
  /* brightness добивает светло-серые подложки логотипов до белого,
     который multiply растворяет в песочном фоне */
  filter: grayscale(1) brightness(1.06) contrast(1.05);
  mix-blend-mode: multiply;
  opacity: 0.6;
  transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}
a:hover .brand-logo {
  filter: grayscale(0);
  opacity: 1;
  transform: translateY(-3px);
}
</style>
