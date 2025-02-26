<template>
  <div v-if="!loading">
    <div v-for="item in getOrderedItems()" :key="`item-${item.pageOrder}`">
      <template v-if="item.type === 'CARDS'">
        <Cards :productions="item.productions"/>
      </template>
      <template v-else-if="item.type === 'MAIN'">
        <Carousel :productions="item.productions" />
      </template>
      <template v-else-if="item.type === 'DEFAULT'">
        <Collections :title="item.name" :items="item.productions" />
      </template>
      <template v-else-if="item.type === 'CATEGORY'">
        <Categories :title="item.name" :description="item.description" :categories="item.categories" />
      </template>
    </div>
  </div>
  <div v-else class="flex items-center justify-center p-10 h-screen">
    <fwb-spinner size="12" color="gray"></fwb-spinner>
  </div>
</template>

<script setup>
import { FwbSpinner } from 'flowbite-vue'
import Carousel from '@/components/Carousel.vue'
import Collections from '@/components/Collections.vue'
import Cards from '@/components/Cards.vue'
import Categories from '@/components/Categories.vue'
import api from '@/api'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const MAIN_PAGE_URL = '/ww/mainPage/'

const { t } = useI18n()

const mainPageItems = ref([])

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const response = await api.get(MAIN_PAGE_URL)
    mainPageItems.value = response.data
  } catch (error) {
    console.error('Error fetching collection items:', error)
  } finally {
    loading.value = false
  }
})

const getOrderedItems = () => {
  return mainPageItems.value.sort((a, b) => a.pageOrder - b.pageOrder)
}
</script>
