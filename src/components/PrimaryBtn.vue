<template>
  <button :type="type" class="btn-solid">
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
