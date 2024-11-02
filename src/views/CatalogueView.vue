<template>
  <div class="flex flex-col m-3 xl:m-5 text-lg">
    <breadcrumbs :items="breadcrumbItems" />
    <div class="text-3xl mt-2">
      <h1 class="uppercase font-semibold py-2 hidden">
        {{ $t('Kurwa') }}
      </h1>
    </div>
    <div class="grid grid-cols-2 text-2xl my-3">
      <button type="button" class="flex w-50 mx-auto uppercase py-2 lg:hidden" v-on:click="openFilters = !openFilters">
        <AdjustmentsHorizontalIcon class="h-4 mt-1.5 mr-1" />
        {{ $t('filters') }}
      </button>
      <button type="button" class="flex w-50 mx-auto uppercase py-2">
        <Bars3BottomRightIcon class="h-4 mt-1.5 mr-1" />
        {{ $t('sort') }}
      </button>
    </div>
    <div class="flex">
      <div class="flex=none">
        <catalogue-filter :isOpen="openFilters" @closeModal="openFilters = !openFilters" @applyFilters="applyFilters"
          :brands="$store.getters.catBrands">
        </catalogue-filter>
      </div>
      <div class="grow grid grid-cols-2 xl:grid-cols-4">
        <template v-if="products.length > 0">
          <catalogue-item v-for="item in products" :key="item.id" :id="item.id" :title="item.name"
             :imageUrl="item.image" :oldPrice="item.oldPrice" :newPrice="item.newPrice"
            :type="item.type">
          </catalogue-item>
        </template>
        <template v-else>
          <div class="w-full h-[100px] col-span-4 flex items-center justify-center">
            <h1 class="text-5xl uppercase font-thin mx-auto text-center">{{$t('products_not_found')}}</h1>
          </div>
        </template>
      </div>
    </div>

    <fwb-pagination class="mx-auto py-2" v-model="currentPage" :total-pages="maxPage" :show-labels="false" show-icons
      @page-changed="changePage"></fwb-pagination>
  </div>
</template>

<script setup>
import { FwbBreadcrumb, FwbBreadcrumbItem, FwbPagination } from 'flowbite-vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdjustmentsHorizontalIcon, Bars3BottomRightIcon } from '@heroicons/vue/24/solid/index.js'
import meringa from '@/assets/meringa.jpg'
import meringa2 from '@/assets/meringa2.png'
import CatalogueItem from '@/components/CatalogueItem.vue'
import CatalogueFilter from '@/components/CatalogueFilter.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { ref, computed, onMounted } from 'vue'
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

const changePage = () => {
  route.query.page = currentPage.value
  fetchProducts()
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
  // todo apply query to component
  currentPage.value = route.query.page || 1

  await fetchProducts()
})

const applyFilters = (query) => {
  fetchProducts()
}

const breadcrumbItems = [
  {
    label: t('catalogue'),
    link: '/catalogue'
  }
]

</script>