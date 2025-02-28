<style scoped>
/* Ensure the card image fills the container */
.product-image {
  width: 100%;
  height: 400px; /* Adjust height as needed */
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .product-image {
    height: 200px; /* Smaller height for mobile */
  }
}

/* Discount badge positioned inside the image (Top Left) */
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #030712; /* Dark gray background */
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  z-index: 10;
  opacity: 0.8; /* 80% opacity */
}


.title-container {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em;
}

.price-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2.5em;
}

.old-price {
  font-size: 0.9em;
  color: gray;
  text-decoration: line-through;
}

.new-price {
  font-size: 1.2em;
  font-weight: bold;
}
</style>


<template>
  <fwb-card
    class="relative m-1 xl:m-2 fwb-card shadow-2xl hover:border-2 hover:m-1"
    variant="image"
    style="cursor: pointer;"
  >
    <!-- Image Container with Discount Badge inside -->
    <div class="relative">
      <img
        :alt="title"
        :src="getImgUrl(imageUrl)"
        class="product-image"
        @click="$router.push({ name: 'product', params: { id: id, type: type || 'SINGLE' } })"
      />
      
      <!-- Discount badge positioned inside the top-left corner of the image -->
      <div v-if="discount !== null && discount > 0" class="discount-badge">
        -{{ discount }}%
      </div>
    </div>

    <div class="grid grid-rows-[auto_auto_1fr] p-2 lg:p-3">
      <h5 class="mb-2 md:text-2xl font-normal tracking-tight text-gray-900 title-container min-h-24 max-h-24 overflow-hidden dark:text-white">
        {{ title }}
      </h5>

      <!-- Updated Price Display: New price on top of the old price -->
      <div class="price-container">
        <template v-if="newPrice">
          <span class="new-price">
            {{ currencyFormatter().format(newPrice) }}тг
          </span>
          <span class="old-price">
            {{ currencyFormatter().format(oldPrice) }}тг
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
    discount: {
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
<style scoped>
/* Ensure the card image fills the container */
.product-image {
  width: 100%;
  height: 400px; /* Adjust height as needed */
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .product-image {
    height: 200px; /* Smaller height for mobile */
  }
}

/* Discount badge positioned inside the image (Top Left) */
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #030712; /* Dark gray background */
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  z-index: 10;
  opacity: 0.8; /* 80% opacity */
}

/* Title container */
.title-container {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em;
}

/* Price container: New price on top of old price */
.price-container {
  display: flex;
  flex-direction: column; /* Stacks prices vertically */
  justify-content: center;
  align-items: center;
  min-height: 3em; /* Ensures enough space */
  text-align: center;
}

/* Old price with strikethrough */
.old-price {
  font-size: 0.9em;
  color: gray;
  text-decoration: line-through;
}

/* New price - Larger and Bold */
.new-price {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
