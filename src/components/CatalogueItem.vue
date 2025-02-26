<style>
  .price-container {
    display: flex;
    flex-direction: column; /* Stack prices vertically */
    justify-content: center;
    align-items: center;
    min-height: 3.5em; /* Adjust as needed for spacing */
    text-align: center;
  }
  .price-content {
    display: inline-block;
  }
  .old-price {
    font-size: 0.9em; /* Slightly smaller for distinction */
    color: gray; /* Optional: Color to differentiate old price */
    text-decoration: line-through;
  }
  .new-price {
    font-size: 1.2em; /* Highlight new price */
    font-weight: bold;
  }
</style>

<template>
  <fwb-card 
    class="m-1 xl:m-2 fwb-card shadow-2xl hover:border-2 hover:m-1" 
    :img-alt="title" 
    :img-src="getImgUrl(imageUrl)" 
    variant="image" 
    @click.native="$router.push({ name: 'product', params: { id: id, type: type || 'SINGLE' } })" 
    style="cursor: pointer;">
    <div class="grid grid-rows-[auto_auto_1fr] p-2 lg:p-3">
      <h5 class="mb-2 md:text-2xl font-normal tracking-tight text-gray-900 title-container min-h-24 max-h-24 overflow-hidden dark:text-white">
        {{ title }}
      </h5>
      <div class="price-container">
        <template v-if="newPrice">
          <span class="old-price">
            {{ currencyFormatter().format(oldPrice) }}тг
          </span>
          <span class="new-price">
            {{ currencyFormatter().format(newPrice) }}тг
          </span>
        </template>
        <template v-else>
          <span class="new-price">
            {{ currencyFormatter().format(oldPrice) }}тг
          </span>
        </template>
      </div>
      <div class="grid grid-flow-col justify-stretch mt-2">
        <PrimaryBtn class="p-3 font-semibold mt-3"
          @click="$router.push({ name: 'product', params: { id: id, type: type || 'SINGLE' } })">
          {{ $t('more_info') }}
        </PrimaryBtn>
      </div>
    </div>
  </fwb-card>
</template>



<script>
import { FwbCard } from 'flowbite-vue'

import { defineComponent } from 'vue'
import PrimaryBtn from '@/components/PrimaryBtn.vue'
import { getImgUrl, currencyFormatter } from '@/utils'

export default defineComponent({
  components: { PrimaryBtn, FwbCard },
  props: {
    title: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String,
      default: ''
    },
    oldPrice: {
      required: true,
      type: Number,
      default: 0
    },
    newPrice: {
      required: false,
      type: Number,
      default: null
    },
    id: {
      required: true,
      type: String,
    },
    imageUrl: {
      required: true,
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: null
    }
  },
  methods: {
    getImgUrl,
    currencyFormatter
  }
})
</script>

<style>
.fwb-card img {
  /* Your styles here */
  width: 100%;
  /* Ensure the image takes the full width of the card */
  height: 400px;
  /* Set the desired height for the image */
  object-fit: cover;
  /* Maintain aspect ratio and cover the entire container */
}
@media (max-width: 640px) { /* Tailwind's sm breakpoint (~640px) */
  .fwb-card img {
    height: 200px; /* Set height for mobile screens */
  }
}
.title-container {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Set to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em; /* Adjust this value as needed to fit 2 lines */
}

.price-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2.5em; /* Adjust this value as needed */
}


</style>