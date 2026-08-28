<template>
  <div class="relative" ref="root">
    <label class="field-label" :for="fieldId">{{ label }}</label>

    <div class="relative">
      <input
        :id="fieldId"
        ref="input"
        type="text"
        autocomplete="off"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="field-input pr-7"
        :class="{ 'field-input-error': error }"
        :aria-expanded="open"
        :aria-invalid="Boolean(error)"
        role="combobox"
        aria-autocomplete="list"
        @input="onInput"
        @focus="onFocus"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="chooseActive"
        @keydown.esc="close"
      />

      <button
        type="button"
        class="absolute right-0 bottom-2 text-ink3 hover:text-ink transition-colors disabled:hover:text-ink3"
        :disabled="disabled"
        :aria-label="label"
        tabindex="-1"
        @click="toggle"
      >
        <ChevronDownIcon class="h-4 transition-transform duration-300" :class="{ 'rotate-180': open }" />
      </button>
    </div>

    <span v-if="error" class="field-error">{{ error }}</span>

    <Transition name="combo">
      <div v-if="open" class="combo-menu quiet-scroll" role="listbox">
        <button
          v-for="(option, i) in options"
          :key="optionKey(option)"
          type="button"
          class="combo-option"
          :aria-selected="i === activeIndex"
          role="option"
          @mousedown.prevent="choose(option)"
          @mousemove="activeIndex = i"
        >
          <span class="flex items-baseline justify-between gap-3">
            <span>{{ optionLabel(option) }}</span>
            <span v-if="optionHint(option)" class="text-xs text-ink3 whitespace-nowrap">{{ optionHint(option) }}</span>
          </span>
        </button>

        <p v-if="!options.length" class="px-4 py-3 text-sm text-ink3">{{ $t('nothing_found') }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  labelKey: { type: String, default: 'name' },
  hint: { type: Function, default: null },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'select', 'search', 'open'])

const root = ref(null)
const input = ref(null)
const open = ref(false)
const activeIndex = ref(-1)
const fieldId = `combo-${Math.random().toString(36).slice(2, 9)}`

const optionLabel = (option) => option[props.labelKey]
const optionKey = (option) => option.id ?? optionLabel(option)
const optionHint = (option) => (props.hint ? props.hint(option) : null)

function onInput(event) {
  emit('update:modelValue', event.target.value)
  emit('search', event.target.value)
  open.value = true
  activeIndex.value = -1
}

function onFocus() {
  if (props.disabled) return
  open.value = true
  emit('open')
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    close()
  } else {
    open.value = true
    emit('open')
    input.value?.focus()
  }
}

function close() {
  open.value = false
  activeIndex.value = -1
}

function choose(option) {
  emit('select', option)
  close()
}

function move(step) {
  if (!open.value) {
    open.value = true
    emit('open')
    return
  }
  if (!props.options.length) return
  const next = activeIndex.value + step
  activeIndex.value = (next + props.options.length) % props.options.length
}

function chooseActive() {
  if (open.value && activeIndex.value >= 0) {
    choose(props.options[activeIndex.value])
  }
}

function onClickOutside(event) {
  if (root.value && !root.value.contains(event.target)) close()
}

watch(() => props.disabled, (isDisabled) => {
  if (isDisabled) close()
})

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.combo-enter-active,
.combo-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.combo-enter-from,
.combo-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .combo-enter-active,
  .combo-leave-active {
    transition: opacity 0.15s ease;
  }
  .combo-enter-from,
  .combo-leave-to {
    transform: none;
  }
}
</style>
