// @ts-check
import { defineConfig, sharpImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  image: {
    service: sharpImageService(),
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/_form": {
          target: "http://localhost:4002",
        },
      },
    },
  },

  integrations: [react()],
});