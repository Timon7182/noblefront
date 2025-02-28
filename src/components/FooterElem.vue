<template>
  <div class="bg-gray-950 font-light py-20">
    <div class="md:grid md:grid-cols-4 gap-2">
      <div class="md:hidden">
        <button type="button" class="text-gray-300 mt-3 flex w-50 mx-auto uppercase font-thin py-2"
          @click="scrollToTop">
          {{ $t('go_up') }}
          <ChevronUpIcon class="h-3 mt-1.5 ml-1"></ChevronUpIcon>
        </button>

        <hr class="mt-2" />
      </div>
      <FooterMenu title="catalogue" :items="categories" />
      <FooterMenu title="about_us" :items="aboutUsItems" />
      <FooterMenu title="contacts" :items="contactItems" />
      <div class="text-footer mt-10 md:mt-0 md:py-16 md:pr-10">
        <TwoGisMap />
      </div>
    </div>
  </div>
</template>
<script setup>
import TwoGisMap from "@/components/TwoGisMap.vue";
import FooterMenu from "@/components/FooterMenu.vue";
import { ChevronUpIcon } from "@heroicons/vue/24/solid/index.js";
import { computed } from 'vue'
import { useStore } from 'vuex'
import PublicOffer from "@/views/PublicOffer.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";


const store = useStore()

const categories = computed(() => store.getters.parentCategories.map(el => {
  return {
    key: el.name,
    href: '/catalogue' + (el.id ? `?categoryId=${el.id}` : '')
  }
}))

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const catalogueItems = [
  {
    key: 'cutlery',
  },
  {
    key: 'dishes',
  },
  {
    key: 'wine_glasses',
  },
  {
    key: 'brands',
  },
]

const aboutUsItems = [
  {
    key: 'delivery_info',
    value: 'Delivery Info',
    href: '/delivery-info'
  },
  {
    key: 'garanty_return',
    value: 'Garanty return',
    href: '/garanty-return'
  },
  {
    key: 'public_offer',
    value: 'Public Offer',
    href: '/public-offer'
  },
  {
    key: 'privacy_policy',
    value: 'Privacy policy',
    href: '/privacy-policy'
  }
]


const contactItems = [
  {
    key: 'store_addresses',
    href: 'https://2gis.kz/almaty/search/Noble%2C%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%20%D0%BF%D0%BE%D1%81%D1%83%D0%B4%D1%8B%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%BE%D0%B2?m=76.934863%2C43.220031%2F13.72'
  },
  {
    key: 'working_days',
    href:'https://www.instagram.com/noble_almaty/',
    icon:'instagram'
  },
  {
    key: 'whatsappsamal',
    href:'https://api.whatsapp.com/send?phone=77071710300',
    icon:'whatsapp'
  },
  {
    key: 'whatsappmiras',
    href:'https://api.whatsapp.com/send?phone=77081903717',
    icon:'whatsapp'
  },
  {
    key: 'whatsappastana',
    href:'https://api.whatsapp.com/send?phone=77003933327',
    icon:'whatsapp'
  },
  {
    key: 'working_hours',
  },
  {
    key: 'noblealmaty@gmail.com',
    href: 'mailto:noblealmaty@gmail.com'
  },
]
</script>