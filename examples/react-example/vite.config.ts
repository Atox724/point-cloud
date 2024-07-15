import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          const url = path.normalize(id);
          const searchString = `node_modules${path.sep}`;
          const chunkIndex = url.lastIndexOf(searchString);
          if (chunkIndex !== -1) {
            const chunkName = url.substring(
              chunkIndex + searchString.length,
              url.lastIndexOf(path.sep)
            );
            if (chunkName.includes("react")) {
              return "react-vendor";
            }
            return chunkName;
          }
        }
      }
    }
  }
});
