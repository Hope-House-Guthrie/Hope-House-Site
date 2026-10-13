import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const board = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/board" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      desc: z.string(),
      group: z.enum(["officer", "board", "advisory"]),
      photo: image().optional(),
      //photo: z.string().optional(),
      photoPosition: z.string().optional(),
      order: z.number().optional(),
    }),
});

const testimonials = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/testimonials",
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      photo: image().optional(),
      beforePhoto: image().optional(),
      photoPosition: z.string().default("center"),
      beforePhotoPosition: z.string().default("center"),
      videoUrl: z.union([z.literal(""), z.string().url()]).default(""),
      paragraphs: z.array(z.string()),
      quote: z.string().default(""),
      order: z.number().default(0),
    }),
});

export const collections = { board, testimonials };
