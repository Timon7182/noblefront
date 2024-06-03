import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CatalogueView from '@/views/CatalogueView.vue'
import ProductView from "@/views/ProductView.vue";
import CartView from "@/views/CartView.vue";
import OrderView from "@/views/OrderView.vue";
import PaymentSuccess from "@/views/PaymentSuccess.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: CatalogueView
    },
    {
      path: '/product/:id/:type',
      name: 'product',
      component: ProductView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/order/:id',
      name: 'order',
      component: OrderView
    },
    {
      path: '/payment-success',
      name: 'paymentSuccess',
      component: PaymentSuccess
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
