<template>
  <div>
    <!-- Mobile view -->
    <div class="xl:hidden text-2xl">
      <SearchButton />

      <div class="mt-4 grid grid-cols-3 mx-4">
        <div class="flex justify-start mt-5">
          <Bars3Icon class="h-6 cursor-pointer hover:ring-blue-500 hover:ring-2 rounded"
            @click="showLinks = !showLinks" />
        </div>
        <div class="flex justify-center">
          <FwbA href="/">
            <FwbImg alt="Noble logo" class="w-[125px] h-[45px]" :src="noble_logo" />
          </FwbA>
        </div>
        <div class="w-full flex justify-end mt-5">
          <FwbA
            href="https://2gis.kz/almaty/search/Noble%2C%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%20%D0%BF%D0%BE%D1%81%D1%83%D0%B4%D1%8B%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%BE%D0%B2?m=76.934863%2C43.220031%2F13.72"
            class="mb-2">
            <MapPinIcon class="h-6 cursor-pointer" />
          </FwbA>
          <FwbA href="/cart" class="relative mb-2">
            <ShoppingBagIcon class="ml-2 h-6 cursor-pointer" />
            <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
          </FwbA>
        </div>
      </div>

      <Transition name="link-transition">
        <div v-if="showLinks" @close="showLinks = false" :class="{ 'opacity-0': !showLinks, 'opacity-100': showLinks }"
          class="transition-opacity duration-300 ease-in-out bg-gray-200 my-3">
          <!-- Accordion and category links -->
          <FwbAccordion>
            <FwbAccordionPanel v-for="category in categories" :key="category.name">
              <FwbAccordionHeader>
                <span class="font-thin text-gray-950">
                  {{ category.name }}
                </span>
              </FwbAccordionHeader>
              <FwbAccordionContent class="text-center w-full">
                <template v-if="category.id">
                  <a v-if="category.name === 'Бренд'" :href="`/brands?parentId=${category.id}`"
                    class="dropdown-link is-subcategory all-categories-link">
                    Все
                  </a>
                  <a v-else :href="`/catalogue?categoryId=${category.id}`"
                    class="dropdown-link is-subcategory all-categories-link">
                    Все
                  </a>
                </template>
                <template v-else>
                  <a href="/catalogue" class="block p-2 hover:bg-gray-100">{{ $t('all') }}</a>
                </template>
                <div v-for="subCategory in category.subCategoryPojoList" :key="subCategory.id" class="p-1">
                  <template v-if="subCategory.id">
                    <a :href="`/catalogue?categoryId=${subCategory.id}`" class="block p-2 hover:bg-gray-100">{{
                      subCategory.name }}</a>
                  </template>
                  <template v-else>
                    <a href="/catalogue" class="block p-2 hover:bg-gray-100">{{ subCategory.name }}</a>
                  </template>
                </div>
              </FwbAccordionContent>
            </FwbAccordionPanel>
          </FwbAccordion>
        </div>
      </Transition>
    </div>

    <!-- Desktop view -->
    <div class="hidden xl:block">
      <!-- Fixed header (stripe + logo/search + categories) -->
      <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <!-- Top stripe -->
        <div class="h-10 bg-gray-950"></div>

        <!-- Logo, Search, Cart row -->
        <div class="mt-4 grid grid-cols-3 mx-4 items-center">
          <!-- Logo -->
          <div class="flex justify-start ml-10">
            <FwbA href="/">
              <FwbImg alt="Noble logo" class="w-[125px] h-[45px]" :src="noble_logo" />
            </FwbA>
          </div>

          <!-- Search button -->
          <SearchButton />

          <!-- Map pin and cart -->
          <div class="flex justify-end mt-5 gap-6 mr-10 mb-2">
            <FwbA
              href="https://2gis.kz/almaty/search/Noble%2C%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%20%D0%BF%D0%BE%D1%81%D1%83%D0%B4%D1%8B%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%BE%D0%B2?m=76.934863%2C43.220031%2F13.72"
              class="mb-2">
              <MapPinIcon class="h-7" />
            </FwbA>
            <FwbA href="/cart" class="relative mb-2">
              <ShoppingBagIcon class="h-7" />
              <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
            </FwbA>
          </div>
        </div>

        <!-- Categories row -->
        <div class="w-full flex font-bold justify-around category-dropdowns">
          <CategoryDropdowns :categories="categories" />
        </div>
      </div>

      <!-- Placeholder to offset page content below fixed header -->
      <div class="h-[152px]"></div>
    </div>
  </div>
</template>

<script setup>
import {
  FwbA,
  FwbImg,
  FwbAccordion,
  FwbAccordionContent,
  FwbAccordionHeader,
  FwbAccordionPanel
} from 'flowbite-vue'
import { MapPinIcon, ShoppingBagIcon, Bars3Icon } from '@heroicons/vue/24/solid'
import noble_logo from '@/assets/noble.png'

import { onMounted, onUnmounted, ref, computed } from 'vue'
import SearchButton from '@/components/SearchButton.vue'
import CategoryDropdowns from '@/components/CategoryDropdowns.vue'
import { useStore } from 'vuex'

const store = useStore()

// Reactive state for showing links and sticky header
let showLinks = ref(false)
let isSticky = ref(false)

const cartItems = computed(() => store.state.mainStore.cart || []);

const itemsWithQuantity = computed(() => {
  const uniqueObjectsById = cartItems.value.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { ...item, quantity: 0 };
    }
    acc[item.id].quantity += 1;
    return acc;
  }, {});
  return Object.values(uniqueObjectsById);
});


// Computed property for the count of unique items
const cartItemCount = computed(() => itemsWithQuantity.value.length);

// Fetch categories from Vuex store
const categories = computed(() => store.state.mainStore.categories);

const fetchCategories = async () => {
  await store.dispatch('getCategories');
};

// Function to handle scroll event for sticky header
const scrollHandler = () => {
  isSticky.value = window.scrollY > 100;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', scrollHandler);
  fetchCategories();
});

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler);
});
</script>

<style scoped>
.shopping-bag-container {
  position: relative;
  display: inline-block;
  margin-right: 15px;
}

.category-dropdowns {
  background: white;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 18px;
  /* Fixed width for a circular shape */
  height: 18px;
  /* Fixed height for a circular shape */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .shopping-bag-container {
    margin-right: 10px;
  }

  .cart-count {
    top: -3px;
    right: -8px;
    width: 16px;
    /* Slightly smaller for mobile */
    height: 16px;
    /* Slightly smaller for mobile */
    font-size: 0.7rem;
    /* Adjust font size */
  }
}
</style>
