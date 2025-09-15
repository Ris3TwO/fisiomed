// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercel({}),
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: true,
    },
  },
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