import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Annotation",
      fileName: (format) => `${format}.js`
    },
    rollupOptions: {
      external: ["three"],
      output: {
        globals: {
          three: "THREE"
        }
      }
    }
  },
  plugins: [
    dts({
      outDir: "dist/types"
      // rollupTypes: true
    })
  ]
});
