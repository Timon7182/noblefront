<template>
  <div>
    <label class="field-label" :for="fieldId">{{ label }}</label>
    <input
      :id="fieldId"
      :type="type"
      :inputmode="inputmode"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="field-input"
      :class="{ 'field-input-error': error }"
      :aria-invalid="Boolean(error)"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <span v-if="error" class="field-error">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  inputmode: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'on' },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'blur'])

const fieldId = `field-${Math.random().toString(36).slice(2, 9)}`
</script>
