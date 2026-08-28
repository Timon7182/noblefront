/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js",
    './node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#FAF7F2',
        surface:  '#F2EDE5',
        surface2: '#ECE5D8',
        ink:      '#1A1A18',
        ink2:     '#6B655C',
        ink3:     '#9A948A',
        line:     '#E5DFD4',
        clay:     '#9A6B4F',
        claysoft: '#B8896E',
        cream:    '#EFE7D6',
        danger:   '#A33A2B',
        "vtd-primary": colors.sky,
        "vtd-secondary": colors.gray,
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Times New Roman"', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'wider-lux': '0.3em',
        'logo': '0.4em',
      },
      maxWidth: {
        prose: '50ch',
        narrative: '22ch',
        page: '1320px',
      },
      transitionTimingFunction: {
        'out-lux': 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
      zIndex: {
        nav: '40',
        dropdown: '50',
        'modal-backdrop': '60',
        modal: '70',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
