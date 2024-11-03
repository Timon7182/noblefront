<template>
  <div class="relative my-20">
    <h2 class="text-3xl lg:text-6xl uppercase font-thin text-center md:ml-10 mb-5">
      {{title}}
    </h2>
    <div class="overflow-x-auto flex flex-nowrap items-start lg:justify-around w-full no-scrollbar py-5">
      <div v-for="item in items" :key="item.id"
      class="w-[252px] lg:w-[352px] h-full flex-none py-4 px-4 md:px-10 hover:drop-shadow-2xl hover:border-2">
        <router-link :to="`/product/${item.id}/${item.type}`">
          <img
            class="h-[320px] lg:h-[420px] card-image"
            :src="getImgUrl(item.image)"
            :alt="item.name"
          />
        </router-link>
        <div class="flex flex-col whitespace-nowrap truncate">
          <p class="font-light text-xl text-center my-3">
            {{item.name}}
          </p>
          <p class="text-center font-light text-xl">
            <span class="">
              <template v-if="item.newPrice">
                <span class="line-through">
                  {{currencyFormatter().format(item.oldPrice)}}тг
                </span>
                |{{currencyFormatter().format(item.newPrice)}}тг
              </template>
              <template v-else>
                {{currencyFormatter().format(item.oldPrice)}}тг
              </template>
            </span>
          </p>
          <PrimaryBtn
            v-if="!cart.find(cartItem => cartItem.id === item.id)"
            class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl"
            @click="addToCart(item)"
          >
            {{$t('add_to_cart')}}
          </PrimaryBtn>
          <InCartButton v-else
            class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl"
            :itemsCount="cart.filter(cartItem => cartItem.id === item.id).length"
            @add="addToCart(item)"
            @remove="removeFromCart(item)"
          >
          </InCartButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import PrimaryBtn from "@/components/PrimaryBtn.vue";
import InCartButton from "@/components/InCartButton.vue";
import { getImgUrl, currencyFormatter } from '@/utils'

export default defineComponent({
  methods: {
    currencyFormatter,
    getImgUrl,
    addToCart(item) {
      console.log('dsds',item)
      this.$store.commit('addToCart', item)
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item)
    }
  },
  components: {PrimaryBtn, InCartButton},
  props: {
    title: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      default: []
    }
  },
  computed: {
    cart() {
      return this.$store.state.mainStore.cart || []
    },
  }
})
</script>
