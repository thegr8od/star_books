/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['NotoSansKR', 'sans-serif'], // 기본 sans 폰트를 노토산스로 덮어씁니다
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '0.8' },
          '50%': { transform: 'translateY(-100px)', opacity: '0.5' },
          '100%': { transform: 'translateY(-200px)', opacity: '0' },
        },
      },
      animation: {
        floatUp: 'floatUp 3s ease-in-out',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
