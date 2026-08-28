<template>
  <div class="max-w-page mx-auto px-5 xl:px-8 pt-8 md:pt-12 pb-20">
    <breadcrumbs :items="breadcrumbItems" />

    <h1 class="serif font-light text-[clamp(32px,4.4vw,60px)] leading-[1.05] mt-6 md:mt-8 mb-10 md:mb-14">
      {{ $t('cart') }}
    </h1>

    <!-- Пустая корзина -->
    <div v-if="!itemsWithQuantity.length" class="py-20 text-center border-t border-line">
      <p class="serif font-light italic text-[clamp(22px,2.6vw,34px)] leading-[1.4]">
        {{ $t('cart_empty') }}
      </p>
      <p class="text-[15px] text-ink2 mt-4 max-w-prose mx-auto">{{ $t('cart_empty_hint') }}</p>
      <router-link to="/catalogue" class="btn-line mt-10">
        {{ $t('go_to_catalogue') }}
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-12 xl:gap-16 items-start">
      <!-- Позиции заказа -->
      <section>
        <div class="hidden md:grid grid-cols-[88px_1fr_auto_auto] gap-6 pb-4 border-b border-line text-[11px] uppercase tracking-[0.2em] text-ink2">
          <span></span>
          <span>{{ $t('product') }}</span>
          <span class="w-32 text-center">{{ $t('quantity') }}</span>
          <span class="w-40 text-right">{{ $t('price') }}</span>
        </div>

        <article
          v-for="cartItem in itemsWithQuantity"
          :key="cartItem.id"
          class="grid grid-cols-[88px_1fr] md:grid-cols-[88px_1fr_auto_auto] gap-x-5 gap-y-4 md:gap-6 items-start md:items-center py-6 border-b border-line"
        >
          <router-link
            :to="`/product/${cartItem.id}/${cartItem.type || 'SINGLE'}`"
            class="row-span-3 md:row-span-1 block w-[88px] h-[110px] overflow-hidden bg-surface"
          >
            <img class="w-full h-full object-cover" :src="getImgUrl(cartItem.image)" :alt="cartItem.name" />
          </router-link>

          <div class="min-w-0">
            <router-link :to="`/product/${cartItem.id}/${cartItem.type || 'SINGLE'}`">
              <h2 class="serif text-lg md:text-xl leading-snug">{{ cartItem.name }}</h2>
            </router-link>
            <p v-if="cartItem.brand" class="text-[11px] uppercase tracking-[0.2em] text-ink3 mt-1.5">
              {{ cartItem.brand }}
            </p>
          </div>

          <InCartButton
            class="w-32"
            :itemsCount="cartItem.quantity"
            @add="addToCart(cartItem)"
            @remove="removeFromCart(cartItem)"
          />

          <div class="md:w-40 md:text-right">
            <p class="serif text-xl">
              <template v-if="cartItem.newPrice">
                <span class="old-price-quiet text-sm">
                  {{ currencyFormatter().format(cartItem.oldPrice * cartItem.quantity) }}
                </span>
                {{ currencyFormatter().format(cartItem.newPrice * cartItem.quantity) }} тг
              </template>
              <template v-else>
                {{ currencyFormatter().format(cartItem.oldPrice * cartItem.quantity) }} тг
              </template>
            </p>
            <button
              type="button"
              class="text-xs uppercase tracking-[0.15em] text-ink3 hover:text-danger transition-colors mt-2"
              @click="removeAll(cartItem)"
            >
              {{ $t('remove') }}
            </button>
          </div>
        </article>
      </section>

      <!-- Сводка и оформление -->
      <aside class="xl:sticky xl:top-28">
        <div class="bg-surface p-6 md:p-8">
          <h2 class="text-[11px] uppercase tracking-[0.3em] text-ink mb-6">{{ $t('your_order') }}</h2>

          <dl class="flex flex-col gap-3 text-[15px]">
            <div class="flex justify-between gap-4">
              <dt class="text-ink2">{{ $t('sum') }}</dt>
              <dd>{{ currencyFormatter().format(oldPriceCount) }} тг</dd>
            </div>

            <div v-if="newPriceCount !== oldPriceCount" class="flex justify-between gap-4">
              <dt class="text-ink2">{{ $t('discount') }}</dt>
              <dd class="text-clay">− {{ currencyFormatter().format(oldPriceCount - newPriceCount) }} тг</dd>
            </div>

            <!-- Сумму доставки показываем, только когда она известна:
                 у части способов тариф считает служба доставки -->
            <div v-if="deliveryCost" class="flex justify-between gap-4">
              <dt class="text-ink2">{{ $t('delivery') }}</dt>
              <dd>{{ currencyFormatter().format(deliveryCost) }} тг</dd>
            </div>
          </dl>

          <div class="flex justify-between items-baseline gap-4 mt-6 pt-5 border-t border-line">
            <span class="text-[11px] uppercase tracking-[0.2em] text-ink2">{{ $t('total') }}</span>
            <span class="serif text-[28px] leading-none">{{ currencyFormatter().format(finalTotal) }} тг</span>
          </div>
        </div>

        <form class="mt-10" novalidate @submit.prevent="createOrder">
          <h2 class="text-[11px] uppercase tracking-[0.3em] text-ink mb-6">{{ $t('contacts_form') }}</h2>

          <div class="flex flex-col gap-6">
            <TextField
              v-model="createOrderForm.name"
              :label="$t('name')"
              :placeholder="$t('enter_your_name')"
              autocomplete="name"
              :error="errors.name"
              @blur="validateName"
            />

            <TextField
              v-model="createOrderForm.email"
              type="email"
              inputmode="email"
              :label="$t('email')"
              placeholder="name@mail.ru"
              autocomplete="email"
              :error="errors.email"
              @blur="validateEmail"
            />

            <TextField
              :modelValue="phoneDisplay"
              type="tel"
              inputmode="tel"
              :label="$t('phone')"
              placeholder="+7 (___) ___-__-__"
              autocomplete="tel"
              :error="errors.phone"
              @update:modelValue="onPhoneInput"
              @blur="validatePhone"
            />
          </div>

          <h2 class="text-[11px] uppercase tracking-[0.3em] text-ink mt-10 mb-6">{{ $t('delivery_form') }}</h2>

          <div class="flex flex-col gap-6">
            <ComboField
              v-model="cityInput"
              :label="$t('city')"
              :placeholder="$t('enter_your_city')"
              :options="filteredCities"
              :error="errors.city"
              @search="onCitySearch"
              @open="onCityOpen"
              @select="selectCity"
            />

            <ComboField
              v-model="deliveryTypeInput"
              :label="$t('deliveryType')"
              :placeholder="$t('select_delivery_type')"
              :options="filteredDeliveryTypes"
              :disabled="!selectedCity"
              :hint="deliveryHint"
              :error="errors.delivery"
              @search="onDeliverySearch"
              @open="onDeliveryOpen"
              @select="selectDeliveryType"
            />

            <ComboField
              v-if="isSelfDelivery"
              v-model="storageInput"
              :label="$t('selectStorage')"
              :placeholder="$t('select_storage')"
              :options="filteredStorages"
              :error="errors.storage"
              @search="onStorageSearch"
              @open="onStorageOpen"
              @select="selectStorage"
            />

            <TextField
              v-else
              v-model="createOrderForm.address"
              :label="$t('address')"
              :placeholder="$t('enter_your_address')"
              autocomplete="street-address"
              :error="errors.address"
              @blur="validateAddress"
            />

            <p v-if="selectedDeliveryType?.description" class="text-[13px] text-ink2 leading-relaxed -mt-2">
              {{ selectedDeliveryType.description }}
            </p>
          </div>

          <p v-if="submitError" class="field-error mt-6">{{ submitError }}</p>

          <button type="submit" class="btn-solid w-full mt-8" :disabled="isCreatingOrder">
            <span v-if="isCreatingOrder">{{ $t('creatingOrder') }}…</span>
            <span v-else>{{ $t('createOrder') }}</span>
          </button>

          <p class="text-xs text-ink2 mt-4 leading-relaxed">
            {{ $t('mainStoreAddress') }}
          </p>
        </form>
      </aside>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import InCartButton from "@/components/InCartButton.vue";
import TextField from "@/components/TextField.vue";
import ComboField from "@/components/ComboField.vue";
import { currencyFormatter, getImgUrl } from "@/utils.js";
import { formatPhone, isPhoneComplete, phoneForApi, isEmailValid, isNameValid } from "@/validation.js";
import api from '@/api';

const CREATE_ORDER_URL = '/ww/createOrderNoPayment';

// Бэкенд не отдаёт список салонов, поэтому точки самовывоза заданы здесь
const PICKUP_POINTS = [
  { id: 'samal', city: 'Алматы', name: 'Алматы · Самал-2, 52' },
  { id: 'miras', city: 'Алматы', name: 'Алматы · мкр. Мирас, 2Б' },
  { id: 'astana', city: 'Астана', name: 'Астана · Мангилик Ел, 42' },
];

export default defineComponent({
  components: {
    Breadcrumbs,
    InCartButton,
    TextField,
    ComboField,
  },
  data() {
    return {
      createOrderForm: {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: null,
        cityId: null,
        deliveryType: null,
        deliveryTypeId: null,
      },
      phoneDisplay: '',
      errors: {
        name: '',
        email: '',
        phone: '',
        city: '',
        delivery: '',
        address: '',
        storage: '',
      },
      submitError: '',
      cityInput: '',
      cities: [],
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
      additionalDeliveryCost: 0,
      isCreatingOrder: false,
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
    removeAll(item) {
      for (let i = 0; i < item.quantity; i++) {
        this.$store.commit('removeSingleFromCart', item);
      }
    },

    /* --- Телефон: маска и валидация --- */
    onPhoneInput(value) {
      this.phoneDisplay = formatPhone(value);
      this.createOrderForm.phone = phoneForApi(value);
      if (this.errors.phone && isPhoneComplete(value)) this.errors.phone = '';
    },
    validatePhone() {
      if (!this.phoneDisplay || this.phoneDisplay === '+7 (') {
        this.errors.phone = this.$t('error_required');
        return false;
      }
      this.errors.phone = isPhoneComplete(this.phoneDisplay) ? '' : this.$t('error_phone');
      return !this.errors.phone;
    },
    validateName() {
      if (!this.createOrderForm.name) {
        this.errors.name = this.$t('error_required');
        return false;
      }
      this.errors.name = isNameValid(this.createOrderForm.name) ? '' : this.$t('error_name');
      return !this.errors.name;
    },
    validateEmail() {
      if (!this.createOrderForm.email) {
        this.errors.email = this.$t('error_required');
        return false;
      }
      this.errors.email = isEmailValid(this.createOrderForm.email) ? '' : this.$t('error_email');
      return !this.errors.email;
    },
    validateAddress() {
      if (this.isSelfDelivery) return true;
      this.errors.address = this.createOrderForm.address?.trim() ? '' : this.$t('error_address');
      return !this.errors.address;
    },

    /* --- Город --- */
    onCityOpen() {
      if (!this.cities.length) this.fetchCities('');
      else this.filteredCities = this.cities;
    },
    onCitySearch(value) {
      this.cityInput = value;
      this.resetCitySelection();
      this.fetchCities(value);
    },
    fetchCities(name) {
      api.get('/ww/deliveryCities', { params: { name } })
        .then(response => {
          this.cities = response.data || [];
          this.filteredCities = this.cities;
        })
        .catch(error => {
          console.error('Failed to fetch cities:', error);
          this.filteredCities = [];
        });
    },
    selectCity(city) {
      this.cityInput = city.name;
      this.createOrderForm.city = city.name;
      this.createOrderForm.cityId = city.id;
      this.selectedCity = city;
      this.errors.city = '';
      this.deliveryTypes = city.deliveryPojoList || [];
      this.deliveryTypeInput = '';
      this.filteredDeliveryTypes = this.deliveryTypes;
      this.resetDeliveryTypeSelection();
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

    /* --- Способ доставки --- */
    deliveryHint(delivery) {
      if (!delivery.deliveryPrice) return null;
      return `${currencyFormatter().format(delivery.deliveryPrice)} тг`;
    },
    onDeliveryOpen() {
      this.filteredDeliveryTypes = this.deliveryTypes;
    },
    onDeliverySearch(value) {
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
      this.errors.delivery = '';
      this.filteredDeliveryTypes = this.deliveryTypes;

      const code = delivery.code ? delivery.code.toUpperCase() : '';
      this.additionalDeliveryCost = code === 'CITY' ? 4000 : 0;

      this.isSelfDelivery = code === 'MYSELF';
      if (this.isSelfDelivery) {
        this.createOrderForm.address = '';
        this.errors.address = '';
        this.storages = this.pickupPointsForCity;
        this.filteredStorages = this.storages;
      } else {
        this.storageInput = '';
        this.storages = [];
        this.filteredStorages = [];
      }
    },
    resetDeliveryTypeSelection() {
      this.createOrderForm.deliveryType = null;
      this.createOrderForm.deliveryTypeId = null;
      this.selectedDeliveryType = null;
      this.isSelfDelivery = false;
      this.storageInput = '';
      this.filteredStorages = [];
      this.storages = [];
      this.additionalDeliveryCost = 0;
    },

    /* --- Салон для самовывоза --- */
    onStorageOpen() {
      this.filteredStorages = this.storages;
    },
    onStorageSearch(value) {
      this.storageInput = value;
      this.filteredStorages = this.storages.filter(storage =>
        storage.name.toLowerCase().includes(value.toLowerCase())
      );
    },
    selectStorage(storage) {
      this.storageInput = storage.name;
      this.selectedStorage = storage;
      this.errors.storage = '';
      this.filteredStorages = this.storages;
    },

    validateAll() {
      const checks = [this.validateName(), this.validateEmail(), this.validatePhone()];

      this.errors.city = this.createOrderForm.cityId ? '' : this.$t('error_city');
      this.errors.delivery = this.createOrderForm.deliveryTypeId ? '' : this.$t('error_delivery');
      checks.push(!this.errors.city, !this.errors.delivery);

      if (this.isSelfDelivery) {
        this.errors.storage = this.selectedStorage ? '' : this.$t('error_storage');
        checks.push(!this.errors.storage);
      } else {
        checks.push(this.validateAddress());
      }

      return checks.every(Boolean);
    },

    createOrder() {
      if (this.isCreatingOrder) return;

      this.submitError = '';
      if (!this.validateAll()) {
        this.submitError = this.$t('please_fill_all_required_fields');
        return;
      }

      this.isCreatingOrder = true;

      const itemsWithoutImages = this.itemsWithQuantity.map(item => {
        const rest = { ...item };
        delete rest.images;
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
      // Самовывоз: вместо адреса клиента уходит выбранный салон
      orderPayload.address = this.isSelfDelivery
        ? this.selectedStorage.name
        : this.createOrderForm.address;

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
              email: this.createOrderForm.email
            };
            paymentObject.auth = access_token;

            window.halyk.pay(paymentObject);
          } else {
            this.submitError = this.$t('order_processing_issue');
          }
        })
        .catch(error => {
          console.error("Order creation failed:", error);
          this.submitError = this.$t('order_creation_error');
        })
        .finally(() => {
          this.isCreatingOrder = false;
        });
    },
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.$t('cart')
        }
      ];
    },
    cartItems() {
      return this.$store.state.mainStore.cart || [];
    },
    pickupPointsForCity() {
      const city = this.selectedCity?.name;
      const inCity = PICKUP_POINTS.filter(point => point.city === city);
      return inCity.length ? inCity : PICKUP_POINTS;
    },
    oldPriceCount() {
      return this.itemsWithQuantity.reduce((total, item) => total + item.oldPrice * item.quantity, 0);
    },
    newPriceCount() {
      return this.itemsWithQuantity.reduce((total, item) => total + ((item.newPrice ? item.newPrice : item.oldPrice) * item.quantity), 0);
    },
    deliveryCost() {
      if (this.selectedDeliveryType && this.selectedDeliveryType.deliveryPrice) {
        return this.selectedDeliveryType.deliveryPrice;
      }
      return this.additionalDeliveryCost;
    },
    finalTotal() {
      return this.newPriceCount + this.deliveryCost;
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
