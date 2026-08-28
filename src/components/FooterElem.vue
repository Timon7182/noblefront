<template>
  <footer class="bg-bg border-t border-line mt-24 md:mt-36 pt-14 md:pt-20 pb-10">
    <div class="max-w-page mx-auto px-5 xl:px-8">
      <!-- «Наверх» — только мобильный -->
      <button
        type="button"
        class="md:hidden mx-auto mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ink2 hover:text-ink transition-colors"
        @click="scrollToTop"
      >
        {{ $t('go_up') }}
        <ChevronUpIcon class="h-3" />
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1.3fr] gap-x-10 gap-y-12">
        <div>
          <router-link to="/" class="serif text-[30px] tracking-[0.35em] font-normal inline-block">NOBLE</router-link>
          <p class="text-sm text-ink2 mt-4 max-w-[30ch] leading-relaxed">{{ $t('tagline') }}</p>
        </div>

        <FooterMenu title="catalogue" :items="categories" />
        <FooterMenu title="about_us" :items="aboutUsItems" />
        <FooterMenu title="contacts" :items="contactItems" />
      </div>

      <div class="mt-14 md:mt-16 border border-line overflow-hidden">
        <TwoGisMap />
      </div>

      <div class="mt-10 pt-7 border-t border-line flex flex-col sm:flex-row justify-between gap-3 text-xs text-ink2">
        <span>© {{ new Date().getFullYear() }} Noble</span>
        <span class="serif italic text-sm">Almaty · Astana</span>
      </div>
    </div>
  </footer>
</template>
<script setup>
import TwoGisMap from "@/components/TwoGisMap.vue";
import FooterMenu from "@/components/FooterMenu.vue";
import { ChevronUpIcon } from "@heroicons/vue/24/outline/index.js";
import { computed } from 'vue'
import { useStore } from 'vuex'

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
