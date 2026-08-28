<template>
  <section
    v-if="productions && productions.length"
    class="relative overflow-hidden h-[86vh] min-h-[560px] max-h-[920px]"
    data-parallax-frame
  >
    <!-- Слои изображений: кроссфейд + параллакс + медленный зум -->
    <div class="absolute inset-x-0 -inset-y-[10%]" v-parallax="8">
      <div
        v-for="(product, i) in productions"
        :key="product.id"
        class="absolute inset-0 transition-opacity duration-[1400ms] ease-out-lux"
        :class="i === carouselIndex ? 'opacity-100' : 'opacity-0'"
      >
        <img
          :src="getImgUrl(product.image)"
          :alt="product.name"
          class="w-full h-full object-cover"
          :class="{ 'hero-kenburns': i === carouselIndex }"
        />
      </div>
    </div>

    <!-- Градиент вместо плашки -->
    <div class="absolute inset-0 bg-gradient-to-b from-ink/25 via-ink/5 to-ink/60"></div>

    <!-- Контент -->
    <div class="absolute inset-x-0 bottom-[9vh] text-bg">
      <div class="max-w-page mx-auto px-5 xl:px-8">
        <Transition name="hero-swap" mode="out-in">
          <div :key="currentProduct.id">
            <p class="cat-num text-cream/90 mb-4">
              N° {{ String(carouselIndex + 1).padStart(2, '0') }} / {{ String(productions.length).padStart(2, '0') }}
            </p>
            <h1 class="serif font-light text-[clamp(40px,6vw,88px)] leading-[1.04] max-w-[16ch] [text-wrap:balance]">
              {{ currentProduct.name }}
            </h1>
            <router-link
              :to="`/product/${currentProduct.id}/${currentProduct.type}`"
              class="mt-8 inline-flex items-center gap-3.5 rounded-full border border-bg/60 px-7 py-4 text-xs uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-bg hover:text-ink hover:border-bg"
            >
              {{ $t('view') }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-3.5 h-3.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </router-link>
          </div>
        </Transition>

        <!-- Прогресс слайдов -->
        <div v-if="productions.length > 1" class="flex gap-2.5 mt-10">
          <button
            v-for="(product, i) in productions"
            :key="`dot-${product.id}`"
            class="h-px w-10 relative py-2"
            :aria-label="product.name"
            @click="goTo(i)"
          >
            <span
              class="absolute inset-x-0 top-1/2 h-px transition-colors duration-300"
              :class="i === carouselIndex ? 'bg-bg' : 'bg-bg/35'"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Вертикальный scroll-индикатор -->
    <div class="hero-scroll hidden md:flex">{{ $t('scroll_down') }}</div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getImgUrl } from '@/utils'

const props = defineProps({
  productions: Array
})

const carouselIndex = ref(0)
let interval = null

const currentProduct = computed(() => props.productions[carouselIndex.value] || {})

function createCarouselInterval() {
  interval = setInterval(() => {
    carouselIndex.value = (carouselIndex.value + 1) % props.productions.length
  }, 6000)
}

function goTo(i) {
  carouselIndex.value = i
  clearInterval(interval)
  createCarouselInterval()
}

onMounted(() => {
  if (props.productions.length > 1) createCarouselInterval()
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.hero-kenburns {
  animation: heroZoom 12s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}

@keyframes heroZoom {
  from { transform: scale(1.07); }
  to { transform: scale(1); }
}

.hero-swap-enter-active,
.hero-swap-leave-active {
  transition: opacity 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero-swap-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.hero-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.hero-scroll {
  position: absolute;
  right: 32px;
  bottom: 32px;
  z-index: 2;
  color: #FAF7F2;
  writing-mode: vertical-rl;
  font-size: 10px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  align-items: center;
  gap: 18px;
  opacity: 0.85;
}
.hero-scroll::after {
  content: "";
  width: 1px;
  height: 56px;
  background: rgba(250, 247, 242, 0.7);
  animation: scrollBar 2s ease-in-out infinite;
}
@keyframes scrollBar {
  0%, 100% { transform: scaleY(0.4); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-kenburns { animation: none; }
  .hero-scroll::after { animation: none; }
  .hero-swap-enter-active,
  .hero-swap-leave-active { transition: opacity 0.3s ease; }
  .hero-swap-enter-from,
  .hero-swap-leave-to { transform: none; }
}
</style>
