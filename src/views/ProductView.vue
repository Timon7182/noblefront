<template>
  <div>
    <Transition name="link-transition" mode="out-in" v-if="item">
      <div class="md:px-10 my-5 mx-1 mb-20">
        <breadcrumbs :items="breadcrumbItems" />
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div>
            <FwbCarousel class="carousel w-100 my-3" :pictures="carouselImages" :slide="false" :slide-interval="15000"
              animation>
            </FwbCarousel>
            <div class="hidden md:block mt-3">
              <div ref="imageContainer" class="overflow-x-auto flex flex-nowrap items-start w-full no-scrollbar">
                <div v-for="(pic, index) in item.images" :key="pic" class="flex-none p-1 bg-gray-200"
                  style="min-width: 200px; min-height: 100px;">
                  <img class="card-image cursor-pointer w-[200px] h-[100px] p-1" :src="getImgUrl(pic.image)"
                    :alt="item.name" @click="imageIndex = index" />
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
                {{ $t('description') }}
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
                {{ $t('history') }}
              </button>
              <button @click="toggleHistory">
                <span v-if="showHistory">-</span>
                <span v-else>+</span>
              </button>
            </div>
            <div v-if="showHistory">
              <p class="p-1">{{ item.history }}</p>
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

            <div class="mt-10 flex justify-center">
              <div id="instagram-post"></div>
            </div>
          </div>
        </div>

        <div v-if="item.productionItems && item.productionItems.length">
          <h2 class="text-xl font-semibold my-5">Товары из этой коллекции</h2>
          <Collections :items="item.productionItems"/>
        </div>
        


      </div>
    </Transition>
    <div v-else class="flex items-center justify-center p-10 h-screen">
      <fwb-spinner size="12" color="gray"></fwb-spinner>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch } from 'vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/vue/24/solid/index.js'
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
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
    FwbCarousel,
    FwbSpinner,
    InCartButton
  },
  data() {
    return {
      item: null,
      mainImage: null,
      imageIndex: 0,
      showDescription: false,
      showHistory: false
    }
  },
  computed: {
    breadcrumbItems() {
      console.log(this.$route)
      return [
        {
          label: this.item.name,
          link: this.$route.href
        }
      ]
    },
    sortedImages() {
      return this.item.images.sort((a, b) => a.order - b.order)
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
    },
    instagramLink() {
      return this.item?.externalServiceLink || '';
    }
  },
  mounted() {
    this.fetchItem();
  },
  watch: {
    item(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loadInstagramEmbed();
      }
    }
  },
  methods: {
    fetchItem() {
      try {
        const searchParams = new URLSearchParams()
        searchParams.append('type', this.$route.params.type)
        searchParams.append('productionId', this.$route.params.id)

        api.get(`${GET_ONE_URL}?${searchParams.toString()}`).then((response) => {
          this.item = response.data
        })
      } catch (error) {
        console.error('Error fetching item:', error)
      }
    },
    currencyFormatter,
    getImgUrl,
    handleMoveLeft() {
      const container = this.$refs.imageContainer
      container.scrollTo({
        left: container.scrollLeft - container.clientWidth / 3,
        behavior: 'smooth'
      })
    },
    handleMoveRight() {
      const container = this.$refs.imageContainer
      container.scrollTo({
        left: container.scrollLeft + container.clientWidth / 3,
        behavior: 'smooth'
      })
    },
    changeMainImage(url) {
      this.mainImage = url
    },
    getImageByIndex(index) {
      if (!this.item.images) return null

      const sorted = this.item.images.sort((a, b) => a.order - b.order)
      return sorted[index].image
    },
    addToCart(item) {
      this.$store.commit('addToCart', item)
    },
    removeFromCart(item) {
      this.$store.commit('removeSingleFromCart', item)
    },
    toggleDescription() {
      this.showDescription = !this.showDescription
    },
    toggleHistory() {
      this.showHistory = !this.showHistory
    },
    loadInstagramEmbed() {
      if (!window.instgrm) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.defer = true;
        script.onload = () => this.embedInstagramPost();
        document.head.appendChild(script);
      } else {
        this.embedInstagramPost();
      }
    },
    embedInstagramPost() {
      const embedContainer = document.getElementById('instagram-post');
      embedContainer.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${this.instagramLink}" data-instgrm-version="12"></blockquote>`;
      window.instgrm.Embeds.process();
    }
  }
})
</script>

<style>
.carousel img {
  object-fit: cover;
  height: 500px;
}
</style>
