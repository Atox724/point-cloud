import inject from "@rollup/plugin-inject";
import injectCSS from "vite-plugin-css-injected-by-js";

import { defineConfig } from "../../common/vite.config";

export default defineConfig({
  plugins: [
    inject({
      React: "react"
    }),
    injectCSS()
  ]
});
