<template>
  <section class="my-24 md:my-36 px-5">
    <div class="max-w-[52ch] mx-auto">
      <h2
        v-if="title"
        v-reveal
        class="serif font-light text-[clamp(28px,3.4vw,48px)] leading-[1.1] [text-wrap:balance] mb-8 text-center"
        v-html="title"
      ></h2>

      <div
        v-reveal="1"
        class="prologue-text serif font-light text-[clamp(19px,1.8vw,24px)] leading-[1.5] text-ink [text-wrap:pretty]"
        v-html="description"
      ></div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // CMS присылает секции без заголовка — принимаем null
    title: {
      required: false,
      type: String,
      default: null,
    },
    description: {
      required: true,
      type: String,
    },
  },
});
</script>

<style scoped>
/* Буквица открывает главу; CMS присылает текст, обёрнутый в <html>/<div> */
.prologue-text :deep(> *:first-child)::first-letter,
.prologue-text::first-letter {
  font-size: 2.2em;
  line-height: 0.9;
  float: left;
  padding: 6px 12px 0 0;
  color: #9A6B4F;
}

/* CMS разделяет абзацы пустыми <div><br></div> — своих отступов не добавляем */
.prologue-text :deep(p) {
  margin-bottom: 0.9em;
}

.prologue-text :deep(b) {
  font-weight: 500;
}
</style>
