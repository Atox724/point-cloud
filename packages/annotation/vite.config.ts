import { defineConfig } from "../../common/vite.config";

export default defineConfig({
  build: {
    rollupOptions: {
      external: [/^three/]
    }
  }
});
