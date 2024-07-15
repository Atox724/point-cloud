import inject from "@rollup/plugin-inject";
import { UserConfig } from "vite";
import injectCSS from "vite-plugin-css-injected-by-js";

import { defineConfig } from "../../common/vite.config";

const config: UserConfig = {
  plugins: [
    inject({
      React: "react"
    }),
    injectCSS()
  ]
};

export default defineConfig(config);
