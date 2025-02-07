import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9090", // 백엔드 서버 주소
        changeOrigin: true,
      },
    },
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: "index.html",
  //     },
  //     output: {
  //       assetFileNames: (assetInfo) => {
  //         if (/\.(png|jpg|jpeg|svg|ico|gif|mp4|webm|ogg)$/.test(assetInfo.name)) {
  //           return "assets/[name]-[hash][extname]";
  //         }
  //         return "assets/[name][extname]";
  //       },
  //     },
  //   },
  // },
  // resolve: {
  //   alias: {
  //     "@assets": path.resolve(__dirname, "src/assets"), 
  //     "@images": path.resolve(__dirname, "src/assets/images"), 
  //     "@video": path.resolve(__dirname, "src/assets/video"),
  //   },
  // },
});
