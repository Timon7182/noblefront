<template>
  <div>
    <fwb-dropdown>
      <template #trigger>
        <div>
          <div class="md:hidden">
            <GlobeAltIcon class="ml-2 h-6 cursor-pointer"/>
          </div>
          <div class="hidden md:block">
            <GlobeAltIcon class="h-7 cursor-pointer"/>
          </div>
        </div>
      </template>
      <fwb-list-group id="lang-group">
        <p v-for="lang in langs" :key="lang.key"
           class="p-2 cursor-pointer hover:underline"
           :class="{ 'bg-gray-200': lang.key === locale }"
           @click="changeLang(lang.key)"
        >
          {{ lang.label}}
        </p>
      </fwb-list-group>
    </fwb-dropdown>
  </div>
</template>

<script setup>
import {GlobeAltIcon} from "@heroicons/vue/24/solid/index.js";
import {FwbDropdown, FwbListGroup} from "flowbite-vue";
import { useI18n } from "vue-i18n";

const langs = [
  {
    'key': 'kz',
    'label': 'Қазақша',
  },
  {
    'key': 'ru',
    'label': 'Русский',
  },
  {
    'key': 'en',
    'label': 'English',
  }
]

const { locale } = useI18n();
function changeLang(langKey) {
  localStorage.setItem("locale", langKey)
  locale.value = langKey
}

</script>

<style scoped>
#lang-group {
  width: 100%;
}
</style>