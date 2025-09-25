// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import preact from "@astrojs/preact";

import { i18n } from "./src/i18n/config.ts";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercel({}),
  i18n: i18n,
  env: {
    schema: {
      PUBLIC_BACKEND_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_BACKEND_API_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  integrations: [preact()],
});
