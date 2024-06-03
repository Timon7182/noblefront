<style scoped>
.text-sm {
  font-size: 0.875rem; /* Example size, adjust as needed */
}

.md\:text-base {
  font-size: 1rem; /* Example size for larger screens, adjust as needed */
}
</style>

<template>
  <fwb-breadcrumb class="text-sm mx-3 md:mx-5 md:text-base">
    <FwbA href="/" class="text-sm">
      {{$t('main_page')}}
    </FwbA>
    <span class="flex ml-1" v-for="item in items" :key="item.label">
      <FwbA v-if="item.link" :href="item.link" class="text-sm ml-1">
        / {{item.label}}
      </FwbA>
      <p v-else class="text-sm ml-1">
        / <span class="font-normal">{{item.label}}</span>
      </p>
    </span>
  </fwb-breadcrumb>
</template>

<script>
import {FwbA, FwbBreadcrumb, FwbBreadcrumbItem} from "flowbite-vue";
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    items: {
      required: true,
      default: []
    }
  },

  components: {
    FwbA,
    FwbBreadcrumb, FwbBreadcrumbItem
  }
})
</script>