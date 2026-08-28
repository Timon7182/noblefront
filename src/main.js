import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

import { createI18n } from 'vue-i18n';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import kz from '@/locales/kz.json';
import store from '@/store'
import { reveal, tilt, parallax } from '@/directives/motion'

const localeFromLocalStorage = localStorage.getItem('locale');

const i18n = createI18n({
    legacy: false,
    locale: localeFromLocalStorage || 'ru',
    messages: {
        ru,
        en,
        kz
    }
});

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n);
app.directive('reveal', reveal)
app.directive('tilt', tilt)
app.directive('parallax', parallax)
app.mount('#app')
