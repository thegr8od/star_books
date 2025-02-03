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
    },
  },
  plugins: [],
}