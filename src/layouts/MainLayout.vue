<template>
  <div class="mx-auto">
    <HeaderBar/>
    <RouterView />
    <div class="relative">
      <FooterElem/>
    </div>
  </div>
</template>
<script>
import { RouterView } from 'vue-router'
import HeaderBar from "@/components/HeaderBar.vue";
import FooterElem from "@/components/FooterElem.vue";

export default {
  name: 'MainLayout',
  components: {
    RouterView,
    HeaderBar,
    FooterElem,
  },
}
</script>
