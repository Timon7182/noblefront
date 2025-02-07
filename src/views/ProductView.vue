<template>
  <div>
    <Transition name="link-transition" mode="out-in" v-if="item">
      <div class="md:px-10 my-5 mx-1 mb-20">
        <breadcrumbs :items="breadcrumbItems" />
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div>
            <!-- Main Carousel -->
            <FwbCarousel class="carousel w-100 my-3" :pictures="carouselImages" :slide="false" :slide-interval="15000"
              animation @click="openFullScreenCarousel(0)" />
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

            <!-- Description Section -->
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
              <h2 v-html="item.description"></h2>
            </div>

            <!-- History Section -->
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
              <div class="p-1" v-html="item.history"></div>
            </div>

            <!-- Instagram Section -->
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
              <div id="instagram-post" class="mt-10 flex justify-center" v-html="instagramEmbedCode"></div>
            </div>

            <!-- Price and Cart Section -->
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
            <PrimaryBtn v-if="!cart.find((cartItem) => cartItem.id === item.id)"
              class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl" @click="addToCart(item)">
              {{ $t('add_to_cart') }}
            </PrimaryBtn>
            <InCartButton v-else class="p-4 align-bottom uppercase font-semibold mt-3 drop-shadow-xl"
              :itemsCount="cart.filter((cartItem) => cartItem.id === item.id).length" @add="addToCart(item)"
              @remove="removeFromCart(item)"></InCartButton>
          </div>
        </div>

        <!-- Collection Items Section -->
        <div v-if="item.productionItems && item.productionItems.length">
          <h2 class="text-xl font-semibold my-5 text-center">
            Товары из этой коллекции
          </h2>
          <Collections :items="item.productionItems" />
        </div>
      </div>
    </Transition>

    <!-- Full-Screen Carousel Modal -->
    <div v-if="showFullScreenCarousel"
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      @click.self="closeFullScreenCarousel" @touchstart="startTouch" @touchend="endTouch">
      <button @click="closeFullScreenCarousel" class="absolute top-4 right-4 text-white text-3xl md:text-5xl z-50">
        &times;
      </button>
      <img :src="carouselImages[imageIndex].src" :alt="carouselImages[imageIndex].alt"
        class="max-w-full max-h-full object-contain" />
      <button @click="prevImage"
        class="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl md:text-5xl z-50">
        &larr;
      </button>

      <!-- Next Button -->
      <button @click="nextImage"
        class="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl md:text-5xl z-50">
        &rarr;
      </button>
    </div>
  </div>
</template>


<script>
import { defineComponent, nextTick } from 'vue';

import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { currencyFormatter, getImgUrl } from '@/utils.js';
import PrimaryBtn from '@/components/PrimaryBtn.vue';
import Collections from '@/components/Collections.vue';
import api from '@/api';
import { FwbCarousel, FwbSpinner } from 'flowbite-vue';
import InCartButton from '@/components/InCartButton.vue';

const GET_ONE_URL = '/ww/getProductionById/';

export default defineComponent({
  components: {
    Collections,
    PrimaryBtn,
    Breadcrumbs,
    FwbCarousel,
    FwbSpinner,
    InCartButton,
  },
  data() {
    return {
      item: null,
      mainImage: null,
      imageIndex: 0,
      showDescription: true,
      showHistory: false,
      showInstagram: false,
      showFullScreenCarousel: false,
      touchStartY: 0,
      touchStartX: 0,
      instagramEmbedCode: '', // Add this line
    };
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.item?.name,
          link: this.$route.href,
        },
      ];
    },
    sortedImages() {
      return this.item?.images.sort((a, b) => a.order - b.order) || [];
    },
    carouselImages() {
      return this.sortedImages.map((el) => {
        return {
          src: this.getImgUrl(el.image),
          alt: this.item.name + el.order,
        };
      });
    },
    cart() {
      return this.$store.state.mainStore.cart || [];
    },
  },
  methods: {
    prevImage() {
      if (this.imageIndex > 0) {
        this.imageIndex--;
      } else {
        this.imageIndex = this.carouselImages.length - 1;
      }
    },
    nextImage() {
      if (this.imageIndex < this.carouselImages.length - 1) {
        this.imageIndex++;
      } else {
        this.imageIndex = 0;
      }
    },
    fetchItem() {
      const searchParams = new URLSearchParams();
      searchParams.append('type', this.$route.params.type);
      searchParams.append('productionId', this.$route.params.id);

      api
        .get(`${GET_ONE_URL}?${searchParams.toString()}`)
        .then((response) => {
          this.item = response.data;
          // Load Instagram embed if the section is visible
          if (this.showInstagram) {
            this.loadInstagramEmbed();
          }
        })
        .catch((error) => {
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
    toggleInstagram() {
      this.showInstagram = !this.showInstagram;
      if (this.showInstagram) {
        this.loadInstagramEmbed();
      }
    },
    addToCart(item) {
      this.$store.commit('addToCart', item);
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item);
    },
    openFullScreenCarousel(index = 0) {
      this.imageIndex = index;
      this.showFullScreenCarousel = true;
      document.body.classList.add('overflow-hidden');
    },
    closeFullScreenCarousel() {
      this.showFullScreenCarousel = false;
      document.body.classList.remove('overflow-hidden');
    },
    startTouch(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },
    endTouch(event) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) {
          // Swipe right
          this.prevImage();
        } else if (deltaX < -50) {
          // Swipe left
          this.nextImage();
        }
      } else {
        // Vertical swipe
        if (deltaY > 50) {
          // Swipe down
          this.closeFullScreenCarousel();
        }
      }
    },
    handleEscapeKey(event) {
      if (event.key === 'Escape') {
        this.closeFullScreenCarousel();
      }
    },
    loadInstagramEmbed() {
      if (this.item && this.item.externalServiceLink) {
        const instagramEmbed = `
        <blockquote class="instagram-media" data-instgrm-permalink="${this.item.externalServiceLink}" data-instgrm-version="14" style="width:100%; max-width:540px; margin:0 auto;"></blockquote>
      `;
        this.instagramEmbedCode = instagramEmbed;

        nextTick(() => {
          // Load Instagram embed script
          if (!document.getElementById('instagram-embed-script')) {
            const script = document.createElement('script');
            script.setAttribute('id', 'instagram-embed-script');
            script.setAttribute('src', 'https://www.instagram.com/embed.js');
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
              if (window.instgrm) {
                window.instgrm.Embeds.process();
              }
            };
          } else {
            // If script is already loaded, process the embeds
            if (window.instgrm) {
              window.instgrm.Embeds.process();
            }
          }
        });
      }
    }
  },
  mounted() {
    this.fetchItem();
    window.addEventListener('keydown', this.handleEscapeKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleEscapeKey);
  },
  watch: {
    '$route.params.id': 'fetchItem', // Watch for route param changes and re-fetch item
  },
});
</script>

<style scoped>
.carousel img {
  object-fit: cover;
  height: 500px;
}

.text-center {
  text-align: center;
}

/* Optional: Adjust the Instagram embed styles if needed */
.instagram-media {
  margin: 0 auto !important;
}

.full-screen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-screen-modal img {
  max-width: 100%;
  max-height: 100%;
}
</style>
