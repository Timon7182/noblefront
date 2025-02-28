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
              <MinusCircleIcon class="h-8 cursor-pointer" @click="removeFromCart(cartItem)" />
              <p class="mx-4">{{ cartItem.quantity }}</p>
              <PlusCircleIcon class="h-8 cursor-pointer" @click="addToCart(cartItem)" />
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
            <div class="col-span-4 border-b border-gray-650 mx-10 mt-5"></div>
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
                {{ currencyFormatter().format(oldPriceCount - newPriceCount) }}ТГ
              </h2>
            </template>
            <div class="col-span-2 border-b border-gray-650 mx-10 mt-2"></div>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ $t('total') }}
            </h2>
            <!-- Display final total with additional cost (if any) -->
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{ currencyFormatter().format(finalTotal) }}ТГ
            </h2>

            <!-- User Information Inputs -->
            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.name" name="name" required type="text"
              :label="$t('name')" v-validate="'required'" :placeholder="$t('enter_your_name')">
            </fwb-input>
            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.email" required type="email" name="email"
              :label="$t('email')" v-validate="'required|email'" :placeholder="$t('enter_your_email')">
            </fwb-input>
            <fwb-input class="col-span-2 m-2" v-model="createOrderForm.phone" required type="text" name="phone"
              :label="$t('phone')" v-validate="'required|phone'" :placeholder="$t('enter_your_phone')">
            </fwb-input>

            <!-- City Input with Filtering -->
            <div class="col-span-2 m-2 relative">
              <fwb-input v-model="cityInput" required type="text" name="city" :label="$t('city')"
                v-validate="'required'" :placeholder="$t('enter_your_city')" @input="onCityInputChange"
                @focus="onCityInputFocus"></fwb-input>
              <ul v-if="filteredCities.length"
                class="absolute bg-white border border-gray-300 w-full z-10 max-h-60 overflow-auto">
                <li v-for="city in filteredCities" :key="city.id" class="p-2 cursor-pointer hover:bg-gray-100"
                  @click="selectCity(city)">
                  {{ city.name }}
                </li>
              </ul>
            </div>

            <!-- Delivery Type Select -->
            <div class="col-span-2 m-2 relative" v-if="deliveryTypes.length">
              <fwb-input v-model="deliveryTypeInput" required type="text" name="deliveryType"
                :label="$t('deliveryType')" v-validate="'required'" :placeholder="$t('select_delivery_type')"
                @input="onDeliveryTypeInputChange" @focus="onDeliveryTypeInputFocus"></fwb-input>
              <ul v-if="filteredDeliveryTypes.length"
                class="absolute bg-white border border-gray-300 w-full z-10 max-h-60 overflow-auto">
                <li v-for="delivery in filteredDeliveryTypes" :key="delivery.id"
                  class="p-2 cursor-pointer hover:bg-gray-100" @click="selectDeliveryType(delivery)">
                  {{ delivery.name }}
                </li>
              </ul>
            </div>

            <!-- Address Input or Storage Selection -->
            <div class="col-span-2 m-2" v-if="!isSelfDelivery">
              <fwb-input v-model="createOrderForm.address" required type="text" :label="$t('address')"
                v-validate="'required'" :placeholder="$t('enter_your_address')">
              </fwb-input>
            </div>
            <div class="col-span-2 m-2 relative" v-else>
              <fwb-input v-model="storageInput" required type="text" name="storage" :label="$t('selectStorage')"
                v-validate="'required'" :placeholder="$t('select_storage')" @input="onStorageInputChange"
                @focus="onStorageInputFocus"></fwb-input>
              <ul v-if="filteredStorages.length"
                class="absolute bg-white border border-gray-300 w-full z-10 max-h-60 overflow-auto">
                <li v-for="storage in filteredStorages" :key="storage.id" class="p-2 cursor-pointer hover:bg-gray-100"
                  @click="selectStorage(storage)">
                  {{ storage.nameRu }}
                </li>
              </ul>
            </div>

            <!-- Submit Button -->
            <PrimaryBtn class="col-span-2 w-auto mx-auto px-5 py-3 my-3" @click="createOrder">
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
  components: {
    PrimaryBtn,
    Breadcrumbs,
    PlusCircleIcon,
    MinusCircleIcon,
    FwbInput,
  },
  data() {
    return {
      createOrderForm: {
        name: null,
        email: null,
        phone: null,
        address: null,
        city: null,
        cityId: null,
        deliveryType: null,
        deliveryTypeId: null,
        storageId: null, // added for self-delivery
      },
      cityInput: '',
      filteredCities: [],
      selectedCity: null,
      deliveryTypes: [],
      selectedDeliveryType: null,
      deliveryTypeInput: '',
      filteredDeliveryTypes: [],
      isSelfDelivery: false,
      storages: [],
      storageInput: '',
      filteredStorages: [],
      selectedStorage: null,
      additionalDeliveryCost: 0, // extra cost for "CITY" delivery type
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
    onCityInputFocus() {
      if (!this.cityInput) {
        this.fetchCities('');
      }
    },
    onCityInputChange(event) {
      const value = event.target.value;
      this.cityInput = value;
      this.resetCitySelection();
      this.fetchCities(value);
    },
    fetchCities(name) {
      api.get('/ww/deliveryCities', { params: { name } })
        .then(response => {
          this.filteredCities = response.data;
        })
        .catch(error => {
          console.error('Failed to fetch cities:', error);
        });
    },
    selectCity(city) {
      this.cityInput = city.name;
      this.createOrderForm.city = city.name;
      this.createOrderForm.cityId = city.id;
      this.selectedCity = city;
      this.deliveryTypes = city.deliveryPojoList || [];
      this.deliveryTypeInput = '';
      this.filteredDeliveryTypes = [];
      this.resetDeliveryTypeSelection();
      this.filteredCities = [];
    },
    onDeliveryTypeInputFocus() {
      if (this.deliveryTypes && this.deliveryTypes.length && !this.deliveryTypeInput) {
        this.filteredDeliveryTypes = this.deliveryTypes;
      }
    },
    onDeliveryTypeInputChange(event) {
      const value = event.target.value;
      this.deliveryTypeInput = value;
      this.filteredDeliveryTypes = this.deliveryTypes.filter(delivery =>
        delivery.name.toLowerCase().includes(value.toLowerCase())
      );
      this.resetDeliveryTypeSelection();
    },
    selectDeliveryType(delivery) {
      this.deliveryTypeInput = delivery.name;
      this.createOrderForm.deliveryType = delivery.name;
      this.createOrderForm.deliveryTypeId = delivery.id;
      this.selectedDeliveryType = delivery;
      this.filteredDeliveryTypes = [];

      if (delivery.code && delivery.code.toUpperCase() === 'MYSELF') {
        this.isSelfDelivery = true;
        this.createOrderForm.address = '';
        let cityCode = (this.selectedCity && this.selectedCity.code) ? this.selectedCity.code : 'ALM';
        api.get('/ww/storages', { params: { cityCode } })
          .then(response => {
            this.storages = response.data;
            this.filteredStorages = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch storages:', error);
          });
        this.additionalDeliveryCost = 0;
      } else if (delivery.code && delivery.code.toUpperCase() === 'CITY') {
        this.additionalDeliveryCost = 4000;
        this.isSelfDelivery = false;
      } else {
        this.additionalDeliveryCost = 0;
        this.isSelfDelivery = false;
      }
    },
    resetCitySelection() {
      this.createOrderForm.city = null;
      this.createOrderForm.cityId = null;
      this.selectedCity = null;
      this.deliveryTypes = [];
      this.deliveryTypeInput = '';
      this.filteredDeliveryTypes = [];
      this.resetDeliveryTypeSelection();
    },
    resetDeliveryTypeSelection() {
      this.createOrderForm.deliveryType = null;
      this.createOrderForm.deliveryTypeId = null;
      this.selectedDeliveryType = null;
      // Reset self-delivery fields and additional cost
      this.isSelfDelivery = false;
      this.createOrderForm.storageId = null;
      this.storageInput = '';
      this.filteredStorages = [];
      this.storages = [];
      this.additionalDeliveryCost = 0;
    },
    onStorageInputFocus() {
      if (this.storageInput === '' && this.storages.length > 0) {
        this.filteredStorages = this.storages;
      }
    },
    onStorageInputChange(event) {
      const value = event.target.value;
      this.storageInput = value;
      this.filteredStorages = this.storages.filter(storage =>
        storage.nameRu.toLowerCase().includes(value.toLowerCase())
      );
    },
    selectStorage(storage) {
      this.storageInput = storage.nameRu;
      this.createOrderForm.storageId = storage.id;
      this.selectedStorage = storage;
      this.filteredStorages = [];
    },
    createOrder() {
      if (
        !this.createOrderForm.name ||
        !this.createOrderForm.email ||
        !this.createOrderForm.phone ||
        (!this.isSelfDelivery && !this.createOrderForm.address) ||
        (this.isSelfDelivery && !this.createOrderForm.storageId) ||
        !this.createOrderForm.cityId ||
        !this.createOrderForm.deliveryTypeId
      ) {
        alert(this.$t('please_fill_all_required_fields'));
        return;
      }

      const itemsWithoutImages = this.itemsWithQuantity.map(item => {
        const { images, ...rest } = item;
        return {
          ...rest,
          newPrice: item.newPrice !== null ? item.newPrice : item.oldPrice,
          quantity: item.quantity
        };
      });

      const orderPayload = {
        name: this.createOrderForm.name,
        email: this.createOrderForm.email,
        phone: this.createOrderForm.phone,
        items: itemsWithoutImages,
        cityPojo: {
          id: this.createOrderForm.cityId,
          name: this.createOrderForm.city
        },
        deliveryPojo: {
          id: this.createOrderForm.deliveryTypeId,
          name: this.createOrderForm.deliveryType,
          description: this.selectedDeliveryType ? this.selectedDeliveryType.description : ''
        }
      };
      if (this.isSelfDelivery) {
        orderPayload.storageId = this.createOrderForm.storageId;
      } else {
        orderPayload.address = this.createOrderForm.address;
      }

      api.post(CREATE_ORDER_URL, orderPayload)
        .then((response) => {
          const {
            invId,
            backLink,
            postLink,
            terminal,
            token,
            invoiceIdAlt,
            currency,
            amount
          } = response.data;

          if (invId) {
            const access_token = {
              access_token: token,
              expires_in: "1200",
              refresh_token: "",
              scope: "payment",
              token_type: "Bearer",
            };
            const paymentObject = {
              invoiceId: invId,
              invoiceIdAlt: invoiceIdAlt,
              backLink: backLink,
              failureBackLink: "https://noble.kz/cart",
              postLink: postLink,
              failurePostLink: postLink,
              language: "rus",
              description: "Оплата в интернет магазине",
              accountId: this.createOrderForm.name,
              terminal: terminal,
              amount: amount,
              data: JSON.stringify({
                statement: {
                  name: this.createOrderForm.name,
                  invoiceID: invId,
                }
              }),
              currency: currency,
              phone: this.createOrderForm.phone,
              name: this.createOrderForm.name,
              email: this.createOrderForm.email,
              storageId: this.createOrderForm.storageId
            };
            paymentObject.auth = access_token;

            halyk.pay(paymentObject);
          } else {
            alert(this.$t('order_processing_issue'));
          }
        })
        .catch(error => {
          console.error("Order creation failed:", error);
          alert(this.$t('order_creation_error'));
        });
    },
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
      return this.itemsWithQuantity.reduce((total, item) => total + item.oldPrice * item.quantity, 0);
    },
    newPriceCount() {
      return this.itemsWithQuantity.reduce((total, item) => total + ((item.newPrice ? item.newPrice : item.oldPrice) * item.quantity), 0);
    },
    finalTotal() {
      return this.newPriceCount + this.additionalDeliveryCost;
    },
    itemsWithQuantity() {
      const itemMap = {};
      this.cartItems.forEach(item => {
        if (itemMap[item.id]) {
          itemMap[item.id].quantity += 1;
        } else {
          itemMap[item.id] = { ...item, quantity: 1 };
        }
      });
      return Object.values(itemMap);
    },
  },
});
</script>
