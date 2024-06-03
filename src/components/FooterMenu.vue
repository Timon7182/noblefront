<template>
  <div>
    <!--  Desktop view -->
    <div class="hidden md:block flex flex-col gap-3 items-start justify-center text-footer ml-10 pt-16">
      <h2 class="uppercase font-normal py-2">
        {{$t(title)}}
      </h2>
      <p v-for="item in items" :key="item.key" class="py-2">
        <template v-if="item.href">
          <FwbA
              :href="item.href"
          >
            {{$t(item.key)}}
          </FwbA>
        </template>
        <template v-else>
          {{$t(item.key)}}
        </template>
      </p>
    </div>
    <!--    Mobile view -->
    <div class="md:hidden text-gray-300 px-5">
      <div class="flex cursor-pointer" @click="openMenu = !openMenu">
        <h2 class="uppercase py-3 font-thin">
          {{$t(title)}}
        </h2>
        <p class="ml-auto mr-2 mt-2 text-xl">
          +
        </p>
      </div>

      <Transition name="link-transition">
      <div v-if="openMenu">
        <p v-for="item in items" :key="item.key" class="py-2">
          <template v-if="item.href">
            <FwbA
                target="_blank"
                :href="item.href"
            >
              {{$t(item.key)}}
            </FwbA>
          </template>
          <template v-else>
            {{$t(item.key)}}
          </template>
        </p>
      </div>
      </Transition>

      <hr class="font-thin"/>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import {FwbA} from "flowbite-vue";

export default defineComponent({
  props: {
    title: {
      required: true,
      type: String,
    },
    items: {
      required: true,
      default: []
    }
  },
  data() {
    return {
      openMenu: false
    }
  },
  components: {
    FwbA,
  },
})
</script>