<template>
  <!-- Первая глава начинается сразу под навигацией, без верхнего отступа -->
  <div v-if="!loading" class="[&>div:first-child_section]:mt-0">
    <div v-for="item in getOrderedItems()" :key="`item-${item.pageOrder}`">
      <template v-if="item.type === 'CARDS'">
        <Cards :productions="item.productions"/>
      </template>
      <template v-else-if="item.type === 'MAIN'">
        <Carousel :productions="item.productions" />
      </template>
      <template v-else-if="item.type === 'DEFAULT'">
        <Collections :title="item.name" :items="item.productions" :discount="item.discount" />
      </template>
      <template v-else-if="item.type === 'CATEGORY'">
        <Categories :title="item.name" :description="item.description" :categories="item.categories" />
      </template>
      <template v-else-if="item.type === 'PHOTOS'">
        <Photos :title="item.name" :photos="item.photos" />
      </template>
      <template v-else-if="item.type === 'MAIN_PHOTO'">
        <MainPhoto :title="item.name" :backColor ="item.backColor" :mainImage="item.mainImage" />
      </template>
      <template v-else-if="item.type === 'SIMPLE'">
        <SimpleText :title="item.name" :description="item.description" />
      </template>
    </div>
  </div>
  <div v-else class="flex items-center justify-center p-10 h-[70vh]">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import Carousel from '@/components/Carousel.vue'
import Collections from '@/components/Collections.vue'
import Cards from '@/components/Cards.vue'
import Categories from '@/components/Categories.vue'
import Photos from '../components/Photos.vue'
import MainPhoto from '@/components/MainPhoto.vue'
import SimpleText from '@/components/SimpleText.vue'
import api from '@/api'
import { ref, onMounted } from 'vue'

const MAIN_PAGE_URL = '/ww/mainPage/'

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
