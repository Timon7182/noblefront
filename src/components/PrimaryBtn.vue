<template>
  <button :type="type"
          class="bg-gray-950 opacity-80 font-bolder text-white">
    <slot/>
  </button>
</template>

<script>

import {defineComponent} from "vue";

export default defineComponent({
  props: {
    title: {
      required: false,
      type: String,
    },
    type: {
      required: false,
      default: 'button'
    }
  }
})
</script>