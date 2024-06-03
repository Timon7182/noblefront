<template>
  <div class="md:px-10 my-5">
    <breadcrumbs :items="breadcrumbItems"/>
    <div class="mt-10">
      <h1 class="text-3xl font-light text-center my-5 mb-10">Оформление покупки</h1>
      <div class="flex flex-col xl:flex-row">
        <div class="xl:w-4/5">
          <div class="flex flex-row items-center justify-center">
            <div class="rounded-full h-[70px] w-[70px] bg-gray-300 order-lead-font text-6xl flex items-center justify-center">
              <p class="mb-2">1</p>
            </div>
            <div class="h-[70px] w-[70px] flex items-center justify-center xl:mx-5">
              <ArrowRight/>
            </div>
            <div class="rounded-full h-[70px] w-[70px] bg-gray-300 order-lead-font text-6xl flex items-center justify-center">
              <p class="mb-2">2</p>
            </div>
            <div class="h-[70px] w-[70px] flex items-center justify-center xl:mx-5">
              <ArrowRight/>
            </div>
            <div class="rounded-full h-[70px] w-[70px] bg-gray-300 order-lead-font text-6xl flex items-center justify-center">
              <p class="mb-2">3</p>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center mt-10">
            <div class="font-light text-2xl flex border-b-2 px-10 pb-5">
              <h2 class="order-lead-font text-5xl">1/3</h2>
              <h2 class="ml-5 mt-4">Доставка</h2>
              <ChevronDownIcon class="h-5 w-5 mt-5"/>
            </div>
            <div class="font-light text-2xl flex border-b-2 px-10 pb-5">
              <h2 class="order-lead-font text-5xl">2/3</h2>
              <h2 class="ml-5 mt-4">Личные данные</h2>
              <ChevronDownIcon class="h-5 w-5 mt-5"/>
            </div>
            <div class="font-light text-2xl flex border-b-2 px-10 pb-5">
              <h2 class="order-lead-font text-5xl">
                <p>3/3</p>
              </h2>
              <h2 class="ml-5 mt-4">Способ оплаты</h2>
              <ChevronDownIcon class="h-5 w-5 mt-5"/>
            </div>
          </div>
        </div>
        <div class="xl:w-1/5 xl:ml-5 h-full flex flex-col">
          <div class="grid grid-cols-2 border border-gray-650">
            <h2 class="text-xl font-light text-center px-4 py-2">
              Всего
            </h2>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{currencyFormatter().format(item.oldPrice)}}ТГ
            </h2>

            <h2 class="text-xl font-light text-center px-4 py-2">
              Скидка
            </h2>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{currencyFormatter().format(10000)}}ТГ
            </h2>

            <div class="col-span-2 border-b border-gray-650 mx-10 mt-2"/>

            <h2 class="text-xl font-light text-center px-4 py-2">
              Итого
            </h2>
            <h2 class="text-xl font-light text-center px-4 py-2">
              {{currencyFormatter().format(item.newPrice)}}ТГ
            </h2>

            <PrimaryBtn class="col-span-2 w-auto mx-auto px-5 mx-5 py-3 my-3" @click="$router.push({name: 'order', params: {id: 1505}})">Оформить заказ</PrimaryBtn>
          </div>

          <PrimaryBtn class="col-span-2 w-auto xl:w-full mx-auto px-5 mx-5 py-3 my-3">
            <span class="flex items-center justify-center gap-2">Информация о доставке<ChevronDownIcon class="h-5"/></span>
          </PrimaryBtn>

          <PrimaryBtn class="col-span-2 w-auto xl:w-full mx-auto px-5 mx-5 py-3 my-3">
            <span class="flex items-center justify-center gap-2">Информация о возврате<ChevronDownIcon class="h-5"/></span>
          </PrimaryBtn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {defineComponent} from "vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import PrimaryBtn from "@/components/PrimaryBtn.vue";
import {FwbImg} from "flowbite-vue";
import {ArrowLongRightIcon, ArrowLongLeftIcon, ChevronDownIcon, MinusCircleIcon, PlusCircleIcon} from "@heroicons/vue/24/outline/index.js";
import {currencyFormatter} from "@/utils.js";
import serviz2 from "@/assets/serviz2.jpeg";
import ArrowRight from "@/assets/icons/arrowRight.vue";

export default defineComponent({
  components: {
    ArrowRight,
    PrimaryBtn, FwbImg, Breadcrumbs,PlusCircleIcon,MinusCircleIcon,ChevronDownIcon,ArrowLongRightIcon,ArrowLongLeftIcon},
  data() {
    return {
      item: {
        id: 4,
        name: 'Столовый сервиз на 6 персон “Flora” от  Tognana',
        quantity: 1,
        oldPrice: 110000,
        newPrice: 90000,
        imgSrc: serviz2
      },
    }
  },
  methods: {currencyFormatter},
  computed: {
    breadcrumbItems() {
      return [
        {
          label: 'Оформление покупки',
          link: this.$route
        }
      ]
    }
  },
})
</script>