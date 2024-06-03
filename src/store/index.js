import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import mainStore from "@/store/modules/mainStore";

const store = createStore({
    modules: {
        mainStore
    },
    plugins: [
        createPersistedState({ storage: window.sessionStorage })
    ]
})

export default store;