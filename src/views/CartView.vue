<template>
  <div class="md:px-10 my-5">
    <breadcrumbs :items="breadcrumbItems" />
    <div class="mt-10">
      <h1 class="text-3xl font-light text-center my-5">{{ $t('cart') }}</h1>
      <div class="flex flex-col xl:flex-row">
        <!-- Mobile view -->
        <div class="xl:hidden flex flex-col border border-gray-650 p-4">
          <template v-for="cartItem in itemsWithQuantity" :key="cartItem.id">
            <div class="m-5 flex flex-col items-center justify-center">
              <div class="relative image-container-noh w-[220px] h-[170px]"
                :style="{ backgroundImage: `url(${getImgUrl(cartItem.image)})` }">
              </div>
              <p class="font-light text-sm">{{ cartItem.name }}</p>
            </div>
            <div class="flex justify-center items-center text-xl font-light">
              <MinusCircleIcon class="h-8 text-gray-500 cursor-pointer" @click="removeFromCart(cartItem)" />
              <p class="mx-4">{{ cartItem.quantity }}</p>
              <PlusCircleIcon class="h-8 cursor-pointer" @click="addToCart(cartItem)" />
            </div>

            <div class="flex flex-col items-center justify-center font-light mt-3">
              <template v-if="cartItem.newPrice">
                <p class="line-through text-lg">{{ currencyFormatter().format(cartItem.oldPrice) }}ТГ</p>
                <p class="mt-1 text-2xl">{{ currencyFormatter().format(cartItem.newPrice) }}ТГ</p>
              </template>
              <template v-else>
                <p class="mt-1 text-2xl">{{ currencyFormatter().format(cartItem.oldPrice) }}ТГ</p>
              </template>
            </div>

            <div class="m-2 flex flex-col items-center justify-center text-lg font-light">
              {{ $t('mainStoreAddress') }}
            </div>
          </template>
        </div>

        <!-- Desktop view -->
        <div class="hidden xl:grid grid-cols-4 xl:w-4/5 border border-gray-650 pb-[100px]">
          <h2 class="text-xl font-light text-center p-4">
            {{ $t('product') }}
          </h2>
          <h2 class="text-xl font-light text-center p-4">
            {{ $t('quantity') }}
          </h2>
          <h2 class="text-xl font-light text-center p-4">
            {{ $t('price') }}
          </h2>

          <div class="col-span-4 border-b border-gray-650 mx-10 mt-5"></div>

          <template v-for="cartItem in itemsWithQuantity" :key="cartItem.id">
            <div class="m-10 flex flex-col items-center justify-center">
              <div class="relative image-container-noh w-[220px] h-[170px]"
                :style="{ backgroundImage: `url(${getImgUrl(cartItem.image)})` }">
              </div>
              <p class="font-light text-sm">{{ cartItem.name }}</p>
            </div>

            <div class="flex justify-center items-center text-xl font-light">
              <p class="mr-4">{{ cartItem.quantity }}</p>
              <PlusCircleIcon class="h-8 cursor-pointer" @click="addToCart(cartItem)" />
              <MinusCircleIcon class="h-8 cursor-pointer" @click="removeFromCart(cartItem)" />
            </div>

            <div class="flex flex-col items-center justify-center font-light">
              <template v-if="cartItem.newPrice">
                <p class="line-through text-lg">{{ currencyFormatter().format(cartItem.oldPrice) }}ТГ</p>
                <p class="mt-3 text-2xl">{{ currencyFormatter().format(cartItem.newPrice) }}ТГ</p>
              </template>
              <template v-else>
                <p class="mt-3 text-2xl">{{ currencyFormatter().format(cartItem.oldPrice) }}ТГ</p>
              </template>
            </div>

            <div class="m-10 flex flex-col items-center justify-center text-lg font-light">
              {{ $t('mainStoreAddress') }}
            </div>
          </template>
        </div>

        <!-- Order Summary and Form -->
        <div class="xl:w-1/5 xl:ml-3 h-full flex flex-col">
          <div class="grid grid-cols-2 border border-gray-650">
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ $t('sum') }}
            </h2>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ currencyFormatter().format(oldPriceCount) }}ТГ
            </h2>

            <template v-if="newPriceCount !== oldPriceCount">
              <h2 class="text-xl font-light text-center px-4 py-2">
                {{ $t('discount') }}
              </h2>
              <h2 class="text-xl font-light text-center px-4 py-2">
                {{ currencyFormatter().format(newPriceCount - oldPriceCount) }}ТГ
              </h2>
            </template>

            <div class="col-span-2 border-b border-gray-650 mx-10 mt-2"></div>

            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ $t('total') }}
            </h2>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ currencyFormatter().format(newPriceCount) }}ТГ
            </h2>

            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.name" name="name" required type="text"
              :label="$t('name')" v-validate="'required'" :placeholder="$t('enter_your_name')">
            </fwb-input>

            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.email" required type="email" name="email"
              :label="$t('email')" v-validate="'required|email'" :placeholder="$t('enter_your_email')">
            </fwb-input>

            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.phone" required type="text" :label="$t('phone')"
              v-validate="'required|phone'" :placeholder="$t('enter_your_phone')"></fwb-input>

            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.address" required type="text"
              :label="$t('address')" v-validate="'required'" :placeholder="$t('enter_your_address')"></fwb-input>

            <PrimaryBtn class="col-span-2 w-auto mx-auto px-5 mx-5 py-3 my-3" @click="createOrder()">
              {{ $t('createOrder') }}
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import { FwbInput } from "flowbite-vue";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/vue/24/outline/index.js";
import { currencyFormatter, getImgUrl } from "@/utils.js";
import PrimaryBtn from "@/components/PrimaryBtn.vue";
import api from '@/api';

const CREATE_ORDER_URL = '/ww/createOrderNoPayment';

export default defineComponent({
  components: { PrimaryBtn, Breadcrumbs, PlusCircleIcon, MinusCircleIcon, FwbInput },
  data() {
    return {
      createOrderForm: {
        name: null,
        email: null,
        phone: null,
        address: null,
      }
    };
  },
  methods: {
    getImgUrl,
    currencyFormatter,
    addToCart(item) {
      this.$store.commit('addToCart', item);
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item);
    },
    createOrder() {
      const itemsWithoutImages = this.itemsWithQuantity.map(item => {
        const { images, ...rest } = item;
        return {
          ...rest,
          newPrice: item.newPrice !== null ? item.newPrice : item.oldPrice
        };
      });

      api.post(CREATE_ORDER_URL, {
        ...this.createOrderForm,
        items: itemsWithoutImages
      }).then((response) => {
        const { invId } = response.data;

        if (invId) {
          this.$router.push({ name: 'paymentSuccess', query: { invId } });
        } else {
          alert("There was an issue processing your order. Please try again.");
        }
      }).catch(error => {
        console.error("Order creation failed:", error);
        alert("An error occurred while creating the order. Please try again.");
      });
    }
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.$t('cart'),
          link: this.$route
        }
      ];
    },
    cartItems() {
      return this.$store.state.mainStore.cart || [];
    },
    oldPriceCount() {
      return this.cartItems.reduce((total, item) => total + item.oldPrice, 0);
    },
    newPriceCount() {
      return this.cartItems.reduce((total, item) => total + (item.newPrice ? item.newPrice : item.oldPrice), 0);
    },
    itemsWithQuantity() {
      const uniqueObjectsById = this.cartItems.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
      }, {});

      const uniqueObjectsArray = Object.values(uniqueObjectsById);

      return uniqueObjectsArray.map(obj => {
        obj.quantity = this.cartItems.filter(item => item.id === obj.id).length;
        return obj;
      });
    }
  }
});
</script>
