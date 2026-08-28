<template>
  <div>
    <Transition name="link-transition" mode="out-in">
      <div v-if="item" class="max-w-page mx-auto px-5 xl:px-8 pt-8 md:pt-12 pb-8">
        <breadcrumbs :items="breadcrumbItems" />

        <div class="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 mt-8 md:mt-12 items-start">
          <!-- Галерея -->
          <div class="lg:sticky lg:top-28">
            <div
              v-tilt="5"
              class="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-surface cursor-zoom-in group"
              @click="openFullScreenCarousel(imageIndex)"
            >
              <Transition name="gallery-swap" mode="out-in">
                <img
                  :key="activeImage.src"
                  :src="activeImage.src"
                  :alt="activeImage.alt"
                  class="w-full h-full object-cover transition-transform duration-[1200ms] ease-out-lux group-hover:scale-[1.03]"
                />
              </Transition>

              <span class="cat-num absolute top-4 left-4 bg-bg text-ink px-2.5 py-1">
                {{ String(imageIndex + 1).padStart(2, '0') }} / {{ String(carouselImages.length).padStart(2, '0') }}
              </span>

              <span
                v-if="item.discount !== null && item.discount > 0"
                class="absolute top-4 right-4 bg-bg text-ink text-[11px] tracking-[0.1em] px-2.5 py-1"
              >
                −{{ item.discount }}%
              </span>
            </div>

            <!-- Миниатюры -->
            <div v-if="carouselImages.length > 1" class="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
              <button
                v-for="(pic, index) in carouselImages"
                :key="pic.src"
                class="flex-none w-20 h-24 overflow-hidden bg-surface transition-opacity duration-300"
                :class="index === imageIndex ? 'opacity-100 ring-1 ring-ink' : 'opacity-55 hover:opacity-90'"
                :aria-label="`${item.name} ${index + 1}`"
                @click="imageIndex = index"
              >
                <img class="w-full h-full object-cover" :src="pic.src" :alt="pic.alt" loading="lazy" />
              </button>
            </div>
          </div>

          <!-- Информация -->
          <div>
            <p v-if="item.brand" class="text-[11px] uppercase tracking-[0.25em] text-ink3 mb-3">
              {{ item.brand }}
            </p>
            <h1 class="serif font-light text-[clamp(30px,3.6vw,52px)] leading-[1.08] [text-wrap:balance]">
              {{ item.name }}
            </h1>

            <!-- Цена -->
            <p class="serif text-[clamp(24px,2.6vw,34px)] mt-7">
              <template v-if="item.newPrice">
                <span class="old-price-quiet text-lg">{{ currencyFormatter().format(item.oldPrice) }}</span>
                {{ currencyFormatter().format(item.newPrice) }} тг
              </template>
              <template v-else>
                {{ currencyFormatter().format(item.oldPrice) }} тг
              </template>
            </p>

            <p class="text-sm text-ink2 mt-2">
              <template v-if="item.quantity && item.quantity > 0">
                {{ $t('in_stock') }}: {{ item.quantity }}
              </template>
              <template v-else>
                {{ $t('out_of_stock') }}
              </template>
            </p>

            <!-- Корзина -->
            <div class="mt-8">
              <PrimaryBtn
                v-if="!cart.find(cartItem => cartItem.id === item.id)"
                class="w-full sm:w-auto sm:min-w-[280px]"
                :disabled="!item.quantity || item.quantity <= 0"
                @click="addToCart(item)"
              >
                {{ (!item.quantity || item.quantity <= 0) ? $t('out_of_stock') : $t('add_to_cart') }}
              </PrimaryBtn>

              <InCartButton
                v-else
                class="w-full sm:w-auto sm:min-w-[280px]"
                :itemsCount="cart.filter(cartItem => cartItem.id === item.id).length"
                @add="addToCart(item)"
                @remove="removeFromCart(item)"
                :maxQuantity="item.quantity"
              />
            </div>

            <!-- Аккордеоны -->
            <div class="mt-12">
              <div class="border-t border-line">
                <button class="w-full flex items-center justify-between py-5 text-left" @click="toggleDescription">
                  <span class="text-[11px] uppercase tracking-[0.25em]">{{ $t('description') }}</span>
                  <span class="text-ink2 text-lg leading-none">{{ showDescription ? '−' : '+' }}</span>
                </button>
                <div v-if="showDescription" class="pb-6 text-[15px] leading-relaxed text-ink2 max-w-prose" v-html="item.description"></div>
              </div>

              <div v-if="item.history" class="border-t border-line">
                <button class="w-full flex items-center justify-between py-5 text-left" @click="toggleHistory">
                  <span class="text-[11px] uppercase tracking-[0.25em]">{{ $t('history') }}</span>
                  <span class="text-ink2 text-lg leading-none">{{ showHistory ? '−' : '+' }}</span>
                </button>
                <div v-if="showHistory" class="pb-6 text-[15px] leading-relaxed text-ink2 max-w-prose" v-html="item.history"></div>
              </div>

              <div v-if="item.externalServiceLink" class="border-t border-b border-line">
                <button class="w-full flex items-center justify-between py-5 text-left" @click="toggleInstagram">
                  <span class="text-[11px] uppercase tracking-[0.25em]">Instagram</span>
                  <span class="text-ink2 text-lg leading-none">{{ showInstagram ? '−' : '+' }}</span>
                </button>
                <div v-if="showInstagram" class="pb-6">
                  <div id="instagram-post" class="flex justify-center" v-html="instagramEmbedCode"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Товары из коллекции -->
        <div v-if="item.productionItems && item.productionItems.length" class="mt-12 md:mt-20 border-t border-line">
          <Collections :title="$t('collection_items')" :items="item.productionItems" />
        </div>
      </div>
    </Transition>

    <!-- Полноэкранный просмотр -->
    <div
      v-if="showFullScreenCarousel"
      class="fixed inset-0 bg-ink/95 z-modal flex items-center justify-center"
      @click.self="closeFullScreenCarousel"
      @touchstart="startTouch"
      @touchend="endTouch"
    >
      <button @click="closeFullScreenCarousel" class="absolute top-6 right-6 text-bg z-modal" aria-label="Закрыть">
        <XMarkIcon class="h-7" />
      </button>

      <img :src="carouselImages[imageIndex].src" :alt="carouselImages[imageIndex].alt" class="max-w-[90vw] max-h-[85vh] object-contain" />

      <button
        v-if="carouselImages.length > 1"
        @click="prevImage"
        class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-bg/40 text-bg items-center justify-center hover:bg-bg hover:text-ink transition-colors"
        aria-label="Назад"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
      </button>

      <button
        v-if="carouselImages.length > 1"
        @click="nextImage"
        class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-bg/40 text-bg items-center justify-center hover:bg-bg hover:text-ink transition-colors"
        aria-label="Вперёд"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>

      <p class="absolute bottom-8 left-1/2 -translate-x-1/2 cat-num text-bg/80">
        {{ String(imageIndex + 1).padStart(2, '0') }} / {{ String(carouselImages.length).padStart(2, '0') }}
      </p>
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
import InCartButton from '@/components/InCartButton.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline/index.js';

const GET_ONE_URL = '/ww/getProductionById/';

export default defineComponent({
  components: {
    Collections,
    PrimaryBtn,
    Breadcrumbs,
    InCartButton,
    XMarkIcon,
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
      instagramEmbedCode: '',
    };
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.item?.name,
        },
      ];
    },
    sortedImages() {
      return [...(this.item?.images || [])].sort((a, b) => a.order - b.order);
    },
    carouselImages() {
      return this.sortedImages.map((el) => {
        return {
          src: this.getImgUrl(el.image),
          alt: this.item.name + el.order,
        };
      });
    },
    activeImage() {
      return this.carouselImages[this.imageIndex] || { src: '', alt: '' };
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
          this.imageIndex = 0;
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
      const cartItemCount = this.cart.filter(cartItem => cartItem.id === item.id).length;

      // Ensure the quantity does not exceed stock availability
      if (item.quantity !== null && cartItemCount < item.quantity) {
        this.$store.commit('addToCart', item);
      }
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
          this.prevImage();
        } else if (deltaX < -50) {
          this.nextImage();
        }
      } else {
        // Vertical swipe
        if (deltaY > 50) {
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
    document.body.classList.remove('overflow-hidden');
  },
  watch: {
    '$route.params.id': 'fetchItem',
  },
});
</script>

<style scoped>
.gallery-swap-enter-active,
.gallery-swap-leave-active {
  transition: opacity 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.gallery-swap-enter-from,
.gallery-swap-leave-to {
  opacity: 0;
}

.instagram-media {
  margin: 0 auto !important;
}
</style>
