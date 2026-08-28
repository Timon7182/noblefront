<template>
  <article class="group">
    <div v-tilt="4" class="relative aspect-[4/5] overflow-hidden bg-surface">
      <router-link
        :to="{ name: 'product', params: { id: id, type: type || 'SINGLE' } }"
        class="absolute inset-0 block"
        :aria-label="title"
      >
        <img
          :alt="title"
          :src="getImgUrl(imageUrl)"
          class="w-full h-full object-cover transition-transform duration-[1200ms] ease-out-lux group-hover:scale-105"
          loading="lazy"
        />
      </router-link>

      <span
        v-if="discount !== null && discount > 0"
        class="absolute top-4 left-4 bg-bg text-ink text-[11px] tracking-[0.1em] px-2.5 py-1"
      >
        −{{ discount }}%
      </span>

      <router-link
        :to="{ name: 'product', params: { id: id, type: type || 'SINGLE' } }"
        class="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-bg text-ink flex items-center justify-center
               transition-all duration-300 hover:bg-ink hover:text-bg
               md:opacity-0 md:translate-y-1.5 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        :aria-label="$t('more_info')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[18px] h-[18px]"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </router-link>
    </div>

    <div class="mt-4 flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:items-baseline sm:gap-3">
      <router-link :to="{ name: 'product', params: { id: id, type: type || 'SINGLE' } }" class="min-w-0">
        <h3 class="serif text-lg md:text-xl leading-snug title-clamp">{{ title }}</h3>
      </router-link>
      <p class="text-sm whitespace-nowrap sm:shrink-0">
        <template v-if="newPrice">
          <span class="old-price-quiet text-xs">{{ currencyFormatter().format(oldPrice) }}</span>{{ currencyFormatter().format(newPrice) }} тг
        </template>
        <template v-else>
          {{ currencyFormatter().format(oldPrice) }} тг
        </template>
      </p>
    </div>
  </article>
</template>

<script>
import { defineComponent } from 'vue'
import { getImgUrl, currencyFormatter } from '@/utils'

export default defineComponent({
  props: {
    title: {
      required: true,
      type: String
    },
    description: {
      required: false,
      type: String,
      default: ''
    },
    oldPrice: {
      required: true,
      type: Number,
      default: 0
    },
    newPrice: {
      required: false,
      type: Number,
      default: null
    },
    discount: {
      required: false,
      type: Number,
      default: null
    },
    id: {
      required: true,
      type: String,
    },
    imageUrl: {
      required: true,
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: null
    }
  },
  methods: {
    getImgUrl,
    currencyFormatter
  }
})
</script>

<style scoped>
.title-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
