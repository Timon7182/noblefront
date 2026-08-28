<template>
  <section class="max-w-page mx-auto px-5 xl:px-8 my-24 md:my-36">
    <div class="grid grid-cols-2 gap-5 md:gap-7">
      <article
        v-for="(item, idx) in orderedProducts"
        :key="`card-${item.id}`"
        v-reveal="(idx % 3)"
        :class="{ 'col-span-2': item.order === 1 }"
        class="group"
      >
        <router-link :to="`/product/${item.id}/${item.type}`" class="block">
          <div
            class="relative overflow-hidden bg-surface"
            :class="item.order === 1 ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[3/4] md:aspect-[4/5]'"
            data-parallax-frame
          >
            <img
              v-parallax="6"
              class="parallax-cover transition-transform duration-[1400ms] ease-out-lux group-hover:scale-[1.04]"
              :src="getImgUrl(item.image)"
              :alt="item.name"
            />
          </div>
          <div class="mt-4 flex items-center justify-between gap-4">
            <h2
              class="serif font-light leading-tight [text-wrap:balance]"
              :class="item.order === 1 ? 'text-[clamp(24px,3.4vw,44px)]' : 'text-[clamp(19px,2.2vw,28px)]'"
            >
              {{ item.name }}
            </h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              class="w-5 h-5 shrink-0 text-ink2 transition-all duration-300 group-hover:text-ink group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </div>
        </router-link>
      </article>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { getImgUrl } from '@/utils'

export default defineComponent({
  props: {
    productions: {
      required: true,
      default: []
    }
  },
  computed: {
    orderedProducts() {
      return [...this.productions].sort((a, b) => a.order - b.order)
    }
  },
  methods: {
    getImgUrl,
  }
})
</script>
