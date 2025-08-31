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

export const collections = { books };