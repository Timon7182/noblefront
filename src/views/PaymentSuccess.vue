<!-- src/components/PaymentSuccess.vue -->
<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white text-gray-800 p-10 rounded-lg shadow-xl text-center max-w-md w-full">
            <h1 class="text-4xl font-bold mb-4 text-green-600">Ваш заказ принят</h1>
            <p class="text-lg mb-2">Скоро наши сотрудники с вами свяжутся</p>
            <p class="text-md text-gray-600">
                Ваш заказ под № <span class="font-semibold text-green-700">{{ $route.query.invId }}</span>
            </p>
            <div class="mt-6">
                <router-link to="/" class="text-blue-500 hover:underline">Вернуться на главную</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaymentSuccess',
    mounted() {
        this.$store.commit('removeAllFromCart');
    }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
