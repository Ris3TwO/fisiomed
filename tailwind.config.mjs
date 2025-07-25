// tailwind.config.mjs
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      scrollBehavior: {
        smooth: "smooth",
      },
    },
  },
};
