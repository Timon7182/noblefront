<template>
  <div class="flex justify-between items-center bg-green-950 opacity-80 font-bolder text-white">
    <MinusCircleIcon class="h-6" @click="$emit('remove')" />
    {{ itemsCount }}
    <PlusCircleIcon class="h-6" @click="$emit('add')" />
  </div>
</template>
  
<script>
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/vue/24/outline/index.js'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    PlusCircleIcon,
    MinusCircleIcon
  },
  props: {
    itemsCount: {
      required: true,
      type: Number,
      default: 0,
    }
  }
})
</script>