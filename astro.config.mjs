// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: true,
    },
  },
  env: {
    schema: {
      BACKEND_URL: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
      BACKEND_API_URL: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
    },
  },
});
