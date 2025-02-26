<template>
  <div class="w-full max-w-3xl mx-auto my-10 px-4 text-gray-700">
    <!-- Page Title -->
    <h1 class="text-3xl md:text-5xl font-thin text-center mb-10">
      Доставка и Оплата
    </h1>

    <!-- Intro Paragraph -->
    <p class="mb-6 leading-relaxed">
      Доставка осуществляется при условии 100% предоплаты.
      После оформления заказа наш менеджер свяжется с вами для подтверждения и
      согласования способа оплаты и доставки.
    </p>

    <!-- Delivery Methods -->
    <h2 class="text-xl md:text-2xl font-semibold mb-4">
      Способы доставки:
    </h2>
    <ul class="list-inside list-disc space-y-2 mb-6 pl-4">
      <li>
        Самовывоз – доступен из магазинов в городах
        <strong>Алматы</strong> и <strong>Астана</strong>.
      </li>
      <li>
        Курьерская доставка по Алматы и Астане –
        через Яндекс доставку за счёт покупателя.
      </li>
      <li>
        Междугородняя доставка по Казахстану –
        осуществляется курьерской службой <strong>avislogistics.kz</strong>.
        Срок доставки: 7–10 рабочих дней. Стоимость: <strong>4000 тг</strong>.
      </li>
    </ul>

    <!-- Payment Methods -->
    <h2 class="text-xl md:text-2xl font-semibold mb-4">
      Способы оплаты:
    </h2>
    <ul class="list-inside list-disc space-y-2 mb-6 pl-4">
      <li>Наличные, банковская карта.</li>
      <li>Удалённый счёт на оплату через Halyk Bank и Kaspi Pay.</li>
    </ul>

    <!-- Final Note -->
    <p class="leading-relaxed">
      Перед отправкой каждый товар проходит проверку на наличие
      заводского брака и целостность, поэтому вы можете
      быть уверены в сохранности вашего заказа!
    </p>
  </div>
</template>

<script>
export default {
  name: "DeliveryInfo",
};
</script>

