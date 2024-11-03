<template>
  <div class="relative w-full lg:w-3/5 mx-auto lg:px-10 my-20"> <!-- 90% width on small screens and full width on large -->
    <div class="flex flex-nowrap items-start w-full">
      <div class="gap-3 grid grid-cols-2"> <!-- Adjusted grid settings -->
        <div
          v-for="item in orderedProducts"
          :key="`card-${item.id}`"
          :class="{
            'col-span-2': item.order === 1
          }"
        >
          <Transition name="link-transition" mode="out-in">
            <router-link :to="`/product/${item.id}/${item.type}`">
              <div class="relative">
                <div class="absolute bottom-0 backdrop-blur-xl bg-white/50 h-[100px] w-full"></div>
                <img
                  :class="{
                    'card-image': true,
                    'h-[460px] lg:h-[600px]': item.order === 1,
                    'h-[280px] lg:h-[560px]': item.order > 1
                  }"
                  :src="getImgUrl(item.image)"
                  :alt="item.name"
                />
                <div class="absolute bottom-0 font-thin text-center text-2xl lg:text-5xl w-full h-[100px]">
                  <h2 class="h-full w-full m-auto flex items-center justify-center">{{ item.name }}</h2>
                </div>
              </div>
            </router-link>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import PrimaryBtn from '@/components/PrimaryBtn.vue'
import { FwbA } from 'flowbite-vue'
import { getImgUrl } from '@/utils' // Make sure the path is correct

export default defineComponent({
  components: { FwbA, PrimaryBtn },
  props: {
    productions: {
      required: true,
      default: []
    }
  },
  data() {
    return {
      orderedProducts: []
    }
  },
  mounted() {
    this.orderedProducts = this.productions.sort((a, b) => a.order - b.order)
  },
  methods: {
    handleMoreInfoClick(item) {
      this.$router.push({ name: 'product', params: { id: item.id, type: item.type || 'SINGLE' } })
    },
    getImgUrl,
  }
})
</script>

<style>

</style>