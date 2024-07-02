/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: '#FF841F',
        'orange-hover': '#FFA65E',
        'grey-border': '#C3C3C3',
        'grey-hover': '#F9F9F9',
        'grey-text': '#929292',
        'nav-grey-text': '#7B7B7B',
        'wrong-red': '#FF5151',
        'input-bg': '#F2F2F2',
        'input-text': '#7B7B7B',

        /* Order Navigation button */
        'nav-inactive-border': '#F8F8F8',
        'nav-inactive-icon': '#FF841F',
        'nav-hover-bg': '#FFE6D2',
        'nav-hover-icon': '#FF841F',
        'nav-clicked-bg': '#FF841F',
        'nav-clicked-icon': '#FFFFFF',

        /* Side panel Navigation Buttons */
        'side-inactive-text': '#7B7B7B',
        'side-inactive-icon': '#7B7B7B',
        'side-hover-icon': '#FFFFFF',
        'side-hover-text': '#FFFFFF',
        'side-hover-bg': '#FFA65D',
        'side-clicked-icon': '#FFFFFF',
        'side-clicked-text': '#FFFFFF',
        'side-clicked-bg': '#FF841F',
        'side-onpage-icon': '#FFFFFF',
        'side-onpage-text': '#FFFFFF',
        'side-onpage-bg': '#FF841F'
      }
    }
  },
  plugins: []
}
