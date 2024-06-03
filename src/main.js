import '@/assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

import { createI18n } from 'vue-i18n';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import kz from '@/locales/kz.json';
import store from '@/store'

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
app.mount('#app')
