<template>
  <div class="relative my-20">
    <h2 class="text-3xl lg:text-5xl text-center md:ml-10 mb-5" v-html="title"></h2>
    <div class="overflow-x-auto flex flex-nowrap items-start lg:justify-around w-full no-scrollbar py-5">
      <div v-for="item in items" :key="item.id"
        class="w-[252px] lg:w-[352px] h-full flex-none py-4 px-4 md:px-10 hover:drop-shadow-2xl hover:border-2 relative">
        
        <!-- Image Container with Discount Badge inside -->
        <router-link :to="`/product/${item.id}/${item.type}`" class="relative block">
          <img class="h-[320px] lg:h-[420px] card-image" 
            :src="getImgUrl(item.image)" 
            :alt="item.name" />

          <!-- Discount badge in the top-left corner -->
          <div v-if="item.discount !== null && item.discount > 0" class="discount-badge">
            -{{ item.discount }}%
          </div>
        </router-link>

        <!-- Product Name -->
        <div class="flex flex-col whitespace-nowrap truncate">
          <p class="font-light text-xl text-center my-3">
            {{ item.name }}
          </p>

          <!-- Price section: New price on top, old price below -->
          <div class="price-container">
            <template v-if="item.newPrice">
              <span class="new-price">
                {{ currencyFormatter().format(item.newPrice) }}тг
              </span>
              <span class="old-price">
                {{ currencyFormatter().format(item.oldPrice) }}тг
              </span>
            </template>
            <template v-else>
              <span class="new-price">
                {{ currencyFormatter().format(item.oldPrice) }}тг
              </span>
            </template>
          </div>

          <!-- Add to Cart Button -->
          <PrimaryBtn v-if="!cart.find(cartItem => cartItem.id === item.id)"
            class="p-4 align-bottom font-semibold mt-3 drop-shadow-xl" 
            @click="addToCart(item)">
            {{ $t('add_to_cart') }}
          </PrimaryBtn>

          <!-- In Cart Button -->
          <InCartButton v-else 
            class="p-4 align-bottom font-semibold mt-3 drop-shadow-xl"
            :itemsCount="cart.filter(cartItem => cartItem.id === item.id).length"
            @add="addToCart(item)"
            @remove="removeFromCart(item)">
          </InCartButton>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import { defineComponent } from "vue";
import PrimaryBtn from "@/components/PrimaryBtn.vue";
import InCartButton from "@/components/InCartButton.vue";
import { getImgUrl, currencyFormatter } from '@/utils'

export default defineComponent({
  methods: {
    currencyFormatter,
    getImgUrl,
    addToCart(item) {
      console.log('dsds', item)
      this.$store.commit('addToCart', item)
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item)
    }
  },
  components: { PrimaryBtn, InCartButton },
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
<style scoped>
/* Ensure the product image stays well-aligned */
.card-image {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Discount badge in the top-left of the image */
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #030712; /* Dark gray background */
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  z-index: 10;
  opacity: 0.8; /* 80% opacity */
}

/* Price container: New price on top of old price */
.price-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 3em; /* Adjust as needed */
}

/* Old price (strikethrough style) */
.old-price {
  font-size: 0.9em;
  color: gray;
  text-decoration: line-through;
}

/* New price - Larger and Bold */
.new-price {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
