import { defineCollection, z } from "astro:content";

// z => zod schema

const books = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    img: z.string(),
    description: z.string().optional(),
    download: z.string().url(),
  }),
});

const teams = defineCollection({
  schema: z.object({
    name: z.string(),
    position: z.object({
      es: z.string(),
      en: z.string(),
    }),
    img: z.string(),
    bio: z.object({
      es: z.string(),
      en: z.string(),
    }),
  }),
});

export const collections = { books, teams };
