<template>
  <div class="flex justify-between items-center rounded-full border border-ink text-ink px-4 py-2.5 select-none">
    <button type="button" aria-label="−" class="hover:text-clay transition-colors" @click="$emit('remove')">
      <MinusIcon class="h-4" />
    </button>
    <span class="text-sm tracking-[0.1em]">{{ itemsCount }}</span>
    <button type="button" aria-label="+" class="hover:text-clay transition-colors" @click="$emit('add')">
      <PlusIcon class="h-4" />
    </button>
  </div>
</template>

<script>
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/outline/index.js'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    PlusIcon,
    MinusIcon
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
