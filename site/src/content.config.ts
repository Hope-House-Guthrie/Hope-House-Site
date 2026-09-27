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

export const collections = { board };
