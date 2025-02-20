/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["NotoSansKR", "sans-serif"], // 기본 sans 폰트를 노토산스로 덮어씁니다
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in forwards",
        slideFromLeft: "slideFromLeft 1s ease-out forwards",
        slideFromRight: "slideFromRight 1s ease-out forwards",
        floatUp: "floatUp 3s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
        slideOut: "slideOut 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideFromLeft: {
          "0%": { opacity: "0", transform: "translateX(-100px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideFromRight: {
          "0%": { opacity: "0", transform: "translateX(100px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "0.8" },
          "50%": { transform: "translateY(-100px)", opacity: "0.5" },
          "100%": { transform: "translateY(-200px)", opacity: "0" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
