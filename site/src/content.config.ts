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

const volunteerOpportunities = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/volunteer-opportunities",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

const walkInServices = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/walk-in-services",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

const residentialPrograms = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/residential-programs",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    label: z.string(),
    expectations: z.string().array(),
  }),
});

const partners = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/partners",
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image(),
      url: z.url(),
    }),
});

const founders = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/founders",
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      bio: z.string().optional(),
    }),
});

const coreValues = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/core-values",
  }),
  schema: z.object({
    title: z.string(),
    direction: z.enum(["value-top", "value-bottom"]),
    delay: z.string().regex(/^\d+ms$/),
    statement: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

const spotlights = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/spotlights",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      order: z.number().optional().default(0),
    }),
});

export const collections = {
  board,
  coreValues,
  founders,
  partners,
  residentialPrograms,
  spotlights,
  testimonials,
  volunteerOpportunities,
  walkInServices,
};
