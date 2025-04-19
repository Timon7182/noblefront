import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CatalogueView from '@/views/CatalogueView.vue'
import ProductView from "@/views/ProductView.vue";
import CartView from "@/views/CartView.vue";
import OrderView from "@/views/OrderView.vue";
import PaymentSuccess from "@/views/PaymentSuccess.vue";
import PublicOffer from "@/views/PublicOffer.vue";
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import DeliveryInfo from '@/views/DeliveryInfo.vue';
import GarantyReturn from '@/views/GarantyReturn.vue';
import BrandsPage from '@/views/BrandsPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    { path: '/brands',      name: 'BrandsPage',   component: BrandsPage },
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
    },
    {
      path: "/public-offer",
      name: "PublicOffer",
      component: PublicOffer
    },
    {
      path: "/privacy-policy",
      name: "PrivacyPolicy",
      component: PrivacyPolicy
    },
    {
      path: "/garanty-return",
      name: "GarantyReturn",
      component: GarantyReturn
    },
    {
      path: "/delivery-info",
      name: "DeliveryInfo",
      component: DeliveryInfo
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
