<template>
  <section class="my-24 md:my-36">
    <div class="max-w-page mx-auto px-5 xl:px-8 mb-10 md:mb-14">
      <h2
        v-reveal
        class="serif font-light text-[clamp(30px,4vw,52px)] leading-[1.08] [text-wrap:balance]"
        v-html="title"
      ></h2>
    </div>

    <div class="overflow-x-auto no-scrollbar">
      <div class="rail flex gap-6 md:gap-8 w-max min-w-full">
        <article
          v-for="(item, idx) in items"
          :key="item.id"
          v-reveal="(idx % 4)"
          class="w-[240px] md:w-[300px] flex-none group"
        >
          <div v-tilt class="relative aspect-[4/5] overflow-hidden bg-surface">
            <router-link :to="`/product/${item.id}/${item.type}`" class="absolute inset-0 block">
              <img
                class="w-full h-full object-cover transition-transform duration-[1200ms] ease-out-lux group-hover:scale-105"
                :src="getImgUrl(item.image)"
                :alt="item.name"
              />
            </router-link>

            <span class="cat-num absolute top-4 left-4 bg-bg text-ink px-2.5 py-1">
              N° {{ String(idx + 1).padStart(2, '0') }}
            </span>

            <!-- Тихая метка скидки -->
            <span
              v-if="item.discount !== null && item.discount > 0"
              class="absolute top-4 right-4 bg-bg text-ink text-[11px] tracking-[0.1em] px-2.5 py-1"
            >
              −{{ item.discount }}%
            </span>

            <!-- Кнопка «+» появляется на hover -->
            <button
              v-if="!cart.find(cartItem => cartItem.id === item.id)"
              :aria-label="$t('add_to_cart')"
              class="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-bg text-ink flex items-center justify-center
                     transition-all duration-300 hover:bg-ink hover:text-bg
                     md:opacity-0 md:translate-y-1.5 md:group-hover:opacity-100 md:group-hover:translate-y-0"
              @click.stop="addToCart(item)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-[18px] h-[18px]"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>

          <div class="mt-4 flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:items-baseline sm:gap-3">
            <router-link :to="`/product/${item.id}/${item.type}`" class="min-w-0">
              <h3 class="serif text-lg md:text-xl leading-snug line-clamp-2">{{ item.name }}</h3>
            </router-link>
            <p class="text-sm whitespace-nowrap sm:shrink-0">
              <template v-if="item.newPrice">
                <span class="old-price-quiet text-xs">{{ currencyFormatter().format(item.oldPrice) }}</span>{{ currencyFormatter().format(item.newPrice) }} тг
              </template>
              <template v-else>
                {{ currencyFormatter().format(item.oldPrice) }} тг
              </template>
            </p>
          </div>

          <!-- Счётчик, если товар уже в корзине -->
          <InCartButton
            v-if="cart.find(cartItem => cartItem.id === item.id)"
            class="mt-3"
            :itemsCount="cart.filter(cartItem => cartItem.id === item.id).length"
            @add="addToCart(item)"
            @remove="removeFromCart(item)"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import InCartButton from "@/components/InCartButton.vue";
import { getImgUrl, currencyFormatter } from '@/utils'

export default defineComponent({
  methods: {
    currencyFormatter,
    getImgUrl,
    addToCart(item) {
      this.$store.commit('addToCart', item)
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item)
    }
  },
  components: { InCartButton },
  props: {
    title: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      default: []
    },
    discount: {
      required: false,
      type: Number,
      default: null
    }
  },
  computed: {
    cart() {
      return this.$store.state.mainStore.cart || []
    },
  }
})
</script>
