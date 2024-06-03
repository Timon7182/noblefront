import api from '@/api'

const CATEGORIES_URL = '/ww/getCategories'

const mainStore = {
    state: () => ({
        cart: [],
        categories: [],
    }),

    getters: {
        cart: state => state.cart,
        cartItemsById: (state) => (id) => {
            return state.cart.filter(item => item.id == id)
        },
        categories: state => state.categories,
        catBrands: state => state.categories.find(el => el.name === 'Бренды')?.subCategoryPojoList || null,
        parentCategories: state => state.categories.filter(el => (el && !el.subCategoryPojoList) || (el && el.subCategoryPojoList && el.subCategoryPojoList.length <= 0)),
    },

    actions: {
        async getCategories({ commit }) {
            try {
                const response = await api.get(CATEGORIES_URL)
                commit('setCategories', response.data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
    },

    mutations: {
        addToCart(state, payload) {
            state.cart.push(payload)
        },
        removeAllFromCart(state, payload) {
            state.cart = []
        },
        removeSingleFromCart(state, payload) {
            const firstIndex = state.cart.findIndex(item => item.id === payload.id)
            if (firstIndex > -1) {
                state.cart.splice(firstIndex, 1)
            }
        },
        setCategories(state, payload) {
            state.categories = payload
        }
    }
}
export default mainStore;
