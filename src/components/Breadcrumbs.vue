<template>
  <nav class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.15em] text-ink2" aria-label="breadcrumb">
    <router-link to="/" class="hover:text-ink transition-colors">
      {{ $t('main_page') }}
    </router-link>
    <template v-for="item in items" :key="item.label">
      <span class="text-ink3">/</span>
      <a v-if="item.link" :href="item.link" class="hover:text-ink transition-colors">{{ item.label }}</a>
      <span v-else class="text-ink">{{ item.label }}</span>
    </template>
  </nav>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    items: {
      required: true,
      default: []
    }
  }
})
</script>
