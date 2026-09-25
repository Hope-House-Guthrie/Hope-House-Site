// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import tina from "@tinacms/astro/integration";
import { tinaAdminDevRedirect } from "@tinacms/astro/vite";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }), // or your existing adapter (Vercel, Netlify, ...)
  integrations: [tina()], // append tina() to your existing array
  vite: {
    plugins: [tinaAdminDevRedirect(), tailwindcss()], // lets /admin work in dev
    // Optional: only needed for SSR builds, not fully static sites.
    ssr: { noExternal: ["@tinacms/astro", "@tinacms/bridge"] },
  },
});
