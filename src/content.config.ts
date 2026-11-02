import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { LANGUAGES, SECTIONS } from "./lib/routes";

const optionalUrl = z.preprocess(
  (value) =>
    typeof value === "string"
      ? value.trim() || undefined
      : (value ?? undefined),
  z.url().optional(),
);

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().trim().min(1),
    lang: z.enum(LANGUAGES),
    section: z.enum(SECTIONS),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string().trim().min(1),
    authors: z.string().trim().min(1),
    venue: z.string().trim().min(1),
    year: z.number().int(),
    order: z.number().int().default(0),
    paperUrl: optionalUrl,
    codeUrl: optionalUrl,
  }),
});

export const collections = { pages, publications };
