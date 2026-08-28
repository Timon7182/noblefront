<template>
  <div>
    <!-- Анно-полоса: доставка + языки -->
    <div class="bg-ink text-cream text-[11px] uppercase tracking-[0.12em]">
      <div class="max-w-page mx-auto px-5 xl:px-8 py-2.5 flex items-center justify-between gap-6">
        <span class="opacity-85 truncate">{{ $t('annobar_note') }}</span>
        <div class="hidden md:flex gap-4 shrink-0">
          <button
            v-for="lang in langs"
            :key="lang.key"
            class="uppercase tracking-[0.12em] transition-opacity"
            :class="lang.key === locale ? 'text-white' : 'opacity-60 hover:opacity-100'"
            @click="changeLang(lang.key)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Навигация: sticky с blur -->
    <nav class="sticky top-0 z-nav bg-bg/90 backdrop-blur-md border-b border-line" style="backdrop-filter: saturate(140%) blur(12px);">
      <div class="max-w-page mx-auto px-5 xl:px-8">
        <!-- Desktop -->
        <div class="hidden xl:block">
          <div class="grid grid-cols-[1fr_auto_1fr] items-center py-4">
            <div class="flex items-center gap-6 min-w-0">
              <button
                :aria-label="$t('search')"
                class="text-xs uppercase tracking-[0.2em] hover:text-clay transition-colors inline-flex items-center gap-2"
                @click="searchOpen = !searchOpen"
              >
                <MagnifyingGlassIcon class="h-5" />
                <span>{{ $t('search') }}</span>
              </button>
            </div>

            <router-link to="/" class="text-center leading-none px-8" aria-label="Noble — на главную">
              <span class="serif text-[28px] tracking-logo font-normal pl-[0.4em]">NOBLE</span>
              <span class="block text-[9px] tracking-[0.5em] text-ink2 mt-1 pl-[0.5em] uppercase">almaty</span>
            </router-link>

            <div class="flex items-center justify-end gap-7 min-w-0">
              <a
                href="https://2gis.kz/almaty/search/Noble%2C%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%20%D0%BF%D0%BE%D1%81%D1%83%D0%B4%D1%8B%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%BE%D0%B2?m=76.934863%2C43.220031%2F13.72"
                target="_blank"
                class="text-xs uppercase tracking-[0.2em] hover:text-clay transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <MapPinIcon class="h-5" />
                <span>{{ $t('boutiques') }}</span>
              </a>
              <router-link
                to="/cart"
                class="text-xs uppercase tracking-[0.2em] hover:text-clay transition-colors inline-flex items-center gap-2.5 whitespace-nowrap"
              >
                <ShoppingBagIcon class="h-5" />
                <span>{{ $t('cart') }}</span>
                <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
              </router-link>
            </div>
          </div>

          <!-- Категории: отдельная строка, скроллится при переполнении -->
          <div class="border-t border-line overflow-x-auto no-scrollbar">
            <div class="flex justify-center py-1">
              <CategoryDropdowns :categories="categories" />
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="xl:hidden grid grid-cols-[auto_1fr_auto] items-center py-3.5">
          <button :aria-label="$t('menu')" @click="showLinks = !showLinks">
            <Bars3Icon v-if="!showLinks" class="h-6" />
            <XMarkIcon v-else class="h-6" />
          </button>

          <router-link to="/" class="text-center leading-none" aria-label="Noble — на главную">
            <span class="serif text-[22px] tracking-[0.35em] font-normal pl-[0.35em]">NOBLE</span>
          </router-link>

          <div class="flex items-center gap-4">
            <button :aria-label="$t('search')" @click="searchOpen = !searchOpen">
              <MagnifyingGlassIcon class="h-5" />
            </button>
            <router-link to="/cart" class="relative" :aria-label="$t('cart')">
              <ShoppingBagIcon class="h-5" />
              <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
            </router-link>
          </div>
        </div>

        <!-- Поиск: тонкая строка под навигацией -->
        <Transition name="link-transition">
          <div v-if="searchOpen" class="pb-4">
            <SearchButton />
          </div>
        </Transition>
      </div>

      <!-- Мобильное меню категорий -->
      <Transition name="link-transition">
        <div v-if="showLinks" class="xl:hidden border-t border-line bg-bg max-h-[70vh] overflow-y-auto">
          <div class="px-5 py-2">
            <div v-for="category in categories" :key="category.name" class="border-b border-line last:border-b-0">
              <button
                class="w-full flex items-center justify-between py-4 text-[13px] uppercase tracking-[0.15em]"
                @click="toggleMobileCategory(category.name)"
              >
                {{ category.name }}
                <span class="text-ink2 text-base leading-none">{{ openMobileCategory === category.name ? '−' : '+' }}</span>
              </button>
              <Transition name="link-transition">
                <div v-if="openMobileCategory === category.name" class="pb-4 flex flex-col gap-1">
                  <a
                    v-if="category.id && category.name === 'Бренд'"
                    :href="`/brands?parentId=${category.id}`"
                    class="py-1.5 text-sm text-ink2 hover:text-ink"
                  >{{ $t('all') }}</a>
                  <a
                    v-else
                    :href="category.id ? `/catalogue?categoryId=${category.id}` : '/catalogue'"
                    class="py-1.5 text-sm text-ink2 hover:text-ink"
                  >{{ $t('all') }}</a>
                  <a
                    v-for="subCategory in category.subCategoryPojoList"
                    :key="subCategory.id"
                    :href="subCategory.id ? `/catalogue?categoryId=${subCategory.id}` : '/catalogue'"
                    class="py-1.5 text-sm text-ink2 hover:text-ink"
                  >{{ subCategory.name }}</a>
                </div>
              </Transition>
            </div>

            <!-- Языки в мобильном меню -->
            <div class="flex gap-5 py-4">
              <button
                v-for="lang in langs"
                :key="lang.key"
                class="text-xs uppercase tracking-[0.15em]"
                :class="lang.key === locale ? 'text-ink border-b border-ink' : 'text-ink2'"
                @click="changeLang(lang.key)"
              >
                {{ lang.label }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </div>
</template>

<script setup>
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchButton from '@/components/SearchButton.vue'
import CategoryDropdowns from '@/components/CategoryDropdowns.vue'
import { useStore } from 'vuex'

const store = useStore()
const { locale } = useI18n()

const showLinks = ref(false)
const searchOpen = ref(false)
const openMobileCategory = ref(null)

const langs = [
  { key: 'ru', label: 'RU' },
  { key: 'kz', label: 'KZ' },
  { key: 'en', label: 'EN' }
]

function changeLang(langKey) {
  localStorage.setItem('locale', langKey)
  locale.value = langKey
}

function toggleMobileCategory(name) {
  openMobileCategory.value = openMobileCategory.value === name ? null : name
}

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

const cartItemCount = computed(() => itemsWithQuantity.value.length);

const categories = computed(() => store.state.mainStore.categories);

const fetchCategories = async () => {
  await store.dispatch('getCategories');
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/* Десктоп: счётчик стоит в строке после слова «Корзина» */
.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background-color: #1A1A18;
  color: #FAF7F2;
  font-size: 0.65rem;
  letter-spacing: 0;
}

/* Мобильный: счётчик висит на иконке */
.cart-count {
  position: absolute;
  top: -6px;
  right: -9px;
  background-color: #1A1A18;
  color: #FAF7F2;
  border-radius: 999px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  padding: 0 4px;
}
</style>
