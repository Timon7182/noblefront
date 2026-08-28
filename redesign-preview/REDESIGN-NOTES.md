# Noble — редизайн: пояснительная записка

Этот документ — спутник `index.html`. Он объясняет, *почему* редизайн выглядит именно так, и *как* перенести его в существующий Vue 3 + Tailwind проект.

---

## 1. Концепция: «медленная роскошь»

Тон премиального салона посуды строится не на скидках и крупных кнопках, а на **молчании, типографике и ритме**. Сайт должен ощущаться как разворот журнала *Cabana* или каталога *Hermès Maison*, а не как ещё один маркетплейс.

Три принципа:

1. **Сторителлинг главами.** У главной страницы есть драматургия: пролог → три героя (коллекции) → хроника бренда → выбор куратора → бутики. Это не «секции», это *главы*.
2. **Одна гарнитура для эмоций, одна — для информации.** Сейчас в проекте подключены *Baloo Bhai 2, Abhaya Libre, Tangerine, Great Vibes* — четыре. Это шумит. В редизайне только две: **Cormorant Garamond** (заголовки, цитаты, числа) + **Inter** (UI, кнопки, цены).
3. **Воздух и пауза.** Большие вертикальные отступы (140 px между секциями), узкие колонки текста (макс. 50ch), минимум рамок и теней.

---

## 2. Дизайн-токены

Добавьте в `tailwind.config.js`:

```js
// tailwind.config.js
import colors from 'tailwindcss/colors'

export default {
  darkMode: 'class',
  content: [/* … existing … */],
  theme: {
    extend: {
      colors: {
        bg:       '#FAF7F2',  // основной фон, тёплый off-white
        surface:  '#F2EDE5',  // карточки, разделители-фоны
        surface2: '#ECE5D8',
        ink:      '#1A1A18',  // основной текст (не чистый чёрный)
        ink2:     '#6B655C',  // вторичный текст
        ink3:     '#9A948A',  // третичный, captions
        line:     '#E5DFD4',  // hairline-границы
        clay:     '#9A6B4F',  // акцент: дроп-кэп, иконки
        claysoft: '#B8896E',
        'vtd-primary':   colors.sky,
        'vtd-secondary': colors.gray,
      },
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Times New Roman', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wider-lux': '0.3em',
        'logo':      '0.4em',
      },
      maxWidth: {
        prose:    '50ch',
        narrative:'22ch',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
```

И замените блок `@import url('…')` в `src/assets/main.css` на:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
```

Удалите `.brand-font`, `.product-name-font`, `.order-lead-font` — они больше не нужны. Замените `body` дефолт:

```css
body { @apply bg-bg text-ink font-sans font-light; }
.serif { @apply font-serif; }
```

---

## 3. Что менять в существующих компонентах

| Файл | Что изменить |
|---|---|
| `src/components/NavRightSide.vue` | Убрать чёрную полосу `h-10 bg-gray-950`, заменить на тонкую `anno`-полосу (см. `.anno` в превью): мелкий текст про доставку + переключатель языков. Сделать nav `sticky` с `backdrop-blur`. Логотип центрировать, категории слева, иконки справа — grid-3. |
| `src/components/MainPhoto.vue` | Заменить плашку под заголовком (полупрозрачный прямоугольник) на **eyebrow + крупный serif-заголовок** и тонкую кнопку-pill. Использовать градиент снизу вместо плашки. Добавить вертикальный «scroll» индикатор справа. |
| `src/components/Categories.vue` | Сделать **три большие карточки** (aspect 3/4), каждая со своим номером главы (01/02/03), названием и подписью. Сейчас это серый ряд логотипов — он переедет в новую секцию «Heritage». |
| `src/components/Collections.vue` | Карточки продукта стали тише: убрать `hover:drop-shadow-2xl hover:border-2`, заменить на медленный `scale(1.05)` картинки + появление круглой кнопки `+` правом нижнем углу. Цены — без жирного «discount-badge» в углу; старая цена просто рядом с новой через `<span class="old">`. |
| `src/components/Photos.vue` | Использовать для главы «Хроника бренда» (editorial split): картинка слева + текст справа + строка мета-данных (Основан / Мастеров / В Noble с). |
| `src/components/FooterElem.vue` | Сменить фон с `bg-gray-950` на `bg-bg` с тонкой верхней границей `border-t border-line`. Большой serif-логотип слева, три колонки ссылок справа, mini-line снизу. Дарк-футер не вяжется с премиальной off-white гаммой. |

---

## 4. Микро-взаимодействия

Они и делают «современным». Всё лёгкое, без библиотек:

```js
// src/composables/useReveal.js
import { onMounted } from 'vue'
export function useReveal(selector = '.reveal') {
  onMounted(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll(selector).forEach(el => io.observe(el))
  })
}
```

CSS (один раз в `main.css`):

```css
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1); }
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: .08s; }
.reveal-delay-2 { transition-delay: .16s; }
.reveal-delay-3 { transition-delay: .24s; }
```

Если позже захочется крупного, паралакса и горизонтальных скроллов — поставьте `gsap` + `ScrollTrigger` или `@vueuse/motion`. Но для первой итерации хватит этого.

---

## 5. Структура главной — Vue-эквивалент

`HomeView.vue` сейчас рендерит секции по `item.type` с бэкенда. Сохраняем эту модель, добавляем два новых типа:

```js
// admin/CMS: добавить типы
PROLOGUE      // одно поле: textHtml + signature
EDITORIAL     // image + eyebrow + title + 2 paragraphs + 3 meta items
HERITAGE_STRIP // quote + brands[]
SHOWROOM       // image + locations[]
NEWSLETTER     // title + subtitle
```

Порядок на главной:

```
MAIN_PHOTO      → новый hero
PROLOGUE        → краткая «душа» бренда
CATEGORY        → три героя-карточки (Сервизы / Бокалы / Хрусталь)
EDITORIAL       → история Wedgwood (или текущего фокусного бренда)
DEFAULT         → выбор куратора (4 товара)
HERITAGE_STRIP  → шесть домов
SHOWROOM        → три бутика + карта
NEWSLETTER      → подписка
```

---

## 6. UX-улучшения, которые сразу видны

1. **Sticky-nav с прозрачным blur** — не ворует место, всегда под рукой.
2. **Eyebrow-метки** перед каждым заголовком (`Пролог`, `Хроника бренда`, `Бутики`) — читатель всегда понимает, в какой «главе» он находится.
3. **Номера товаров `N° 01`** в стиле каталога — повышают воспринимаемую ценность без лишних бейджей.
4. **Кнопка `+` появляется на hover** вместо постоянной массивной «Добавить в корзину» — карточка дышит.
5. **Скидки тише**: старая цена → перечёркнута, новая рядом. Без красных плашек.
6. **Тёмная heritage-секция один раз** — как смена настроения в середине ленты, потом снова свет.
7. **Бутики как карточки с телефонами**, не одна общая карта — клиент сразу видит, какой ближе.
8. **Письма Noble** — минимальная подписка, узкое поле + стрелка, без иллюстраций.

---

## 7. Что НЕ переносить из текущего сайта

- Шрифты *Tangerine* и *Great Vibes* — они дают эффект «открытки», а не премиума.
- Класс `font-thin` на заголовках. Cormorant сам по себе хрупкий, `font-thin` Inter превращает текст в тонкую серую плёнку. Используем `font-weight: 300–400`.
- Большие тёмные плашки за заголовком hero. В премиальном UI текст лежит на изображении напрямую, тень делает градиент.
- Tab-наподобие «category dropdowns» белой плашкой — заменить на минимальное hover-меню с подчёркиванием.

---

## 8. Дальше

1. Открыть `redesign-preview/index.html` в браузере, прокликать, поскроллить, посмотреть на телефоне.
2. Решить, какие 2–3 секции запускать первыми (рекомендую: Hero + Three Pillars + Footer — они задают тон, остальное подтянется).
3. Перенести токены в `tailwind.config.js`, шрифты в `main.css`.
4. Переписать `MainPhoto.vue`, `Categories.vue`, `FooterElem.vue` по новой разметке.
5. После — `Collections.vue` (карточки товаров) и nav.

Если нужно, я могу сразу подготовить готовые `.vue` файлы для конкретных компонентов — скажите, с каких начать.
