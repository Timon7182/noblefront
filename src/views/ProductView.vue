<template>
  <div>
    <Transition name="link-transition" mode="out-in" v-if="item">
      <div class="md:px-10 my-5 mx-1 mb-20">
        <breadcrumbs :items="breadcrumbItems" />
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div>
            <!-- Main Carousel -->
            <FwbCarousel
              class="carousel w-100 my-3"
              :pictures="carouselImages"
              :slide="false"
              :slide-interval="15000"
              animation
              @click="openFullScreenCarousel"
            />
            <div class="hidden md:block mt-3">
              <div ref="imageContainer" class="overflow-x-auto flex flex-nowrap items-start w-full no-scrollbar">
                <div v-for="(pic, index) in item.images" :key="pic" class="flex-none p-1 bg-gray-200"
                  style="min-width: 200px; min-height: 100px;">
                  <img class="card-image cursor-pointer w-[200px] h-[100px] p-1" :src="getImgUrl(pic.image)"
                    :alt="item.name" @click="openFullScreenCarousel(index)" />
                </div>
              </div>
            </div>
          </div>
          <div id="info-container" class="flex flex-col md:mx-5 text-center md:text-start text-lg md:w-3/4 md:ml-auto">
            <h1 class="font-thin text-2xl md:text-3xl">
              {{ item.name }}
            </h1>
            <p class="font-thin">
              {{ item.brand }}
            </p>

            <div class="my-5 border-t-2 border-b-2 font-semibold border-gray-950 p-1 flex justify-between items-center">
              <button @click="toggleDescription">
                Описание
              </button>
              <button @click="toggleDescription">
                <span v-if="showDescription">-</span>
                <span v-else>+</span>
              </button>
            </div>
            <div v-if="showDescription">
              <h2>{{ item.description }}</h2>
            </div>

            <div class="my-5 border-t-2 border-b-2 font-semibold border-gray-950 p-1 flex justify-between items-center">
              <button @click="toggleHistory">
                История
              </button>
              <button @click="toggleHistory">
                <span v-if="showHistory">-</span>
                <span v-else>+</span>
              </button>
            </div>
            <div v-if="showHistory">
              <p class="p-1">{{ item.history }}</p>
            </div>

            <div class="my-5 border-t-2 border-b-2 font-semibold border-gray-950 p-1 flex justify-between items-center">
              <button @click="toggleInstagram">
                Instagram
              </button>
              <button @click="toggleInstagram">
                <span v-if="showInstagram">-</span>
                <span v-else>+</span>
              </button>
            </div>
            <div v-if="showInstagram">
              <label>dsds</label>
              <div id="instagram-post" class="mt-10 flex justify-center"></div>
            </div>

            <p class="my-4 self-center text-4xl">
              <template v-if="item.newPrice">
                <span class="line-through font-thin">
                  {{ currencyFormatter().format(item.oldPrice) }}тг
                </span>
                | {{ currencyFormatter().format(item.newPrice) }}тг
              </template>
              <template v-else>
                {{ currencyFormatter().format(item.oldPrice) }}тг
              </template>
            </p>
            <PrimaryBtn v-if="!cart.find(cartItem => cartItem.id === item.id)"
              class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl" @click="addToCart(item)">
              {{ $t('add_to_cart') }}
            </PrimaryBtn>
            <InCartButton v-else class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl"
              :itemsCount="cart.filter(cartItem => cartItem.id === item.id).length" @add="addToCart(item)"
              @remove="removeFromCart(item)">
            </InCartButton>
          </div>
        </div>

        <div v-if="item.productionItems && item.productionItems.length">
          <h2 class="text-xl font-semibold my-5 text-center">Товары из этой коллекции</h2>
          <Collections :items="item.productionItems"/>
        </div>
      </div>
    </Transition>

    <!-- Full-Screen Carousel Modal -->
    <div 
      v-if="showFullScreenCarousel" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
      @click.self="closeFullScreenCarousel"
      @touchstart="startTouch"
      @touchend="endTouch"
    >
      <div class="relative w-full max-w-4xl">
        <button @click="closeFullScreenCarousel" class="absolute top-2 right-2 text-white text-3xl md:text-5xl">&times;</button>
        <FwbCarousel
          class="carousel w-full"
          :pictures="carouselImages"
          :slide="false"
          :slide-interval="15000"
          animation
          :noControls="false"
          :noIndicators="false"
          v-model="imageIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { currencyFormatter, getImgUrl } from '@/utils.js'
import PrimaryBtn from '@/components/PrimaryBtn.vue'
import Collections from '@/components/Collections.vue'
import api from '@/api'
import { FwbCarousel, FwbSpinner } from 'flowbite-vue'
import InCartButton from "@/components/InCartButton.vue";

const GET_ONE_URL = '/ww/getProductionById/'

export default defineComponent({
  components: {
    Collections,
    PrimaryBtn,
    Breadcrumbs,
    FwbCarousel,
    FwbSpinner,
    InCartButton
  },
  data() {
    return {
      item: null,
      mainImage: null,
      imageIndex: 0,
      showDescription: true,
      showHistory: false,
      showInstagram: false,
      showFullScreenCarousel: false, // Modal state
      touchStartY: 0 // Variable to track swipe gesture start position
    }
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.item?.name,
          link: this.$route.href
        }
      ]
    },
    sortedImages() {
      return this.item?.images.sort((a, b) => a.order - b.order) || []
    },
    carouselImages() {
      return this.sortedImages.map((el) => {
        return {
          src: this.getImgUrl(el.image),
          alt: this.item.name + el.order
        }
      })
    },
    cart() {
      return this.$store.state.mainStore.cart || []
    }
  },
  methods: {
    fetchItem() {
      const searchParams = new URLSearchParams();
      searchParams.append('type', this.$route.params.type);
      searchParams.append('productionId', this.$route.params.id);

      api.get(`${GET_ONE_URL}?${searchParams.toString()}`).then((response) => {
        this.item = response.data;
      }).catch(error => {
        console.error('Error fetching item:', error);
      });
    },
    currencyFormatter,
    getImgUrl,
    toggleDescription() {
      this.showDescription = !this.showDescription;
    },
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },
    addToCart(item) {
      this.$store.commit('addToCart', item)
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item)
    },
    toggleInstagram() {
      this.showInstagram = !this.showInstagram;
      if (this.showInstagram) {
        this.loadInstagramEmbed();
      }
    },
    openFullScreenCarousel(index = 0) {
      this.imageIndex = index;
      this.showFullScreenCarousel = true;
    },
    closeFullScreenCarousel() {
      this.showFullScreenCarousel = false;
    },
    startTouch(event) {
      this.touchStartY = event.touches[0].clientY;
    },
    endTouch(event) {
      const touchEndY = event.changedTouches[0].clientY;
      const swipeDistance = touchEndY - this.touchStartY;
      if (swipeDistance > 50) {
        this.closeFullScreenCarousel();
      }
    },
    handleEscapeKey(event) {
      if (event.key === "Escape") {
        this.closeFullScreenCarousel();
      }
    }
  },
  mounted() {
    this.fetchItem();
    window.addEventListener("keydown", this.handleEscapeKey);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleEscapeKey);
  },
  watch: {
    '$route.params.id': 'fetchItem' // Watch for route param changes and re-fetch item
  }
})
</script>

<style scoped>
.carousel img {
  object-fit: cover;
  height: 500px;
}
.text-center {
  text-align: center;
}
</style>
