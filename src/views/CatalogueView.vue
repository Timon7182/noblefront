<template>
  <div class="max-w-page mx-auto px-5 xl:px-8 pt-8 md:pt-12">
    <breadcrumbs :items="breadcrumbItems" />

    <header class="mt-6 md:mt-8 mb-10 md:mb-14 flex flex-wrap items-end justify-between gap-6">
      <h1 class="serif font-light text-[clamp(32px,4.4vw,60px)] leading-[1.05]">
        {{ $t('catalogue') }}
      </h1>

      <button
        type="button"
        class="lg:hidden inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.25em] border-b border-ink pb-1.5"
        @click="openFilters = !openFilters"
      >
        <AdjustmentsHorizontalIcon class="h-4" />
        {{ $t('filters') }}
      </button>
    </header>

    <div class="flex gap-10 xl:gap-14 items-start">
      <aside class="shrink-0">
        <catalogue-filter
          :isOpen="openFilters"
          @closeModal="openFilters = !openFilters"
          @applyFilters="applyFilters"
          :brands="$store.getters.catBrands"
        />
      </aside>

      <div class="grow min-w-0">
        <div v-if="loading" class="flex items-center justify-center py-32">
          <div class="loader"></div>
        </div>

        <div
          v-else-if="products.length > 0"
          class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
        >
          <catalogue-item
            v-for="item in products"
            :key="item.id"
            :id="item.id"
            :title="item.name"
            :discount="item.discount"
            :imageUrl="item.image"
            :oldPrice="item.oldPrice"
            :newPrice="item.newPrice"
            :type="item.type"
          />
        </div>

        <div v-else class="py-32 text-center">
          <p class="serif font-light italic text-[clamp(22px,2.6vw,34px)] leading-[1.4] max-w-[26ch] mx-auto text-ink2">
            {{ $t('products_not_found') }}
          </p>
          <router-link to="/catalogue" class="btn-line mt-10">
            {{ $t('all') }}
          </router-link>
        </div>

        <fwb-pagination
          v-if="!loading && maxPage > 1"
          class="mx-auto py-14 flex justify-center"
          v-model="currentPage"
          :total-pages="maxPage"
          :show-labels="false"
          show-icons
          @page-changed="changePage"
        ></fwb-pagination>
      </div>
    </div>
  </div>
</template>


<script setup>
import { FwbPagination } from 'flowbite-vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline/index.js'
import CatalogueItem from '@/components/CatalogueItem.vue'
import CatalogueFilter from '@/components/CatalogueFilter.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { ref, onMounted } from 'vue'
import api from '@/api'

const PRODUCTS_URL = '/ww/getProductions'

const openFilters = ref(false)
const { t } = useI18n()
const route = useRoute()
const loading = ref(false)
const products = ref([])
const maxPage = ref(1)
const currentPage = ref(1)

const getQuery = (query) => {
  return {
    ...query,
    page: query.page || 1
  }
}

const changePage = async () => {
  route.query.page = currentPage.value
  await fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get(PRODUCTS_URL, {
      params: getQuery(route.query)
    })

    products.value = response.data.items
    maxPage.value = response.data.maxPage
  } catch (error) {
    products.value = []
    maxPage.value = 1
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  currentPage.value = route.query.page || 1

  await fetchProducts()
})

const applyFilters = () => {
  fetchProducts()
}

const breadcrumbItems = [
  {
    label: t('catalogue')
  }
]

</script>
