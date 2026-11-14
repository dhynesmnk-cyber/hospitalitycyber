import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Zod comes from Astro's own copy. Do not add `zod` to package.json.
import { z } from 'astro/zod';

// Shared by every page type. `draft` keeps an entry out of production builds.
// `noindex` publishes it with a noindex robots tag.
const page = {
  title: z.string().max(60),
  description: z.string().max(155),
  draft: z.boolean().default(false),
  noindex: z.boolean().default(false),
};

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
  schema: z.object({
    ...page,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const chapters = defineCollection({
  loader: glob({ base: './src/content/chapters', pattern: '**/*.md' }),
  schema: z.object({
    ...page,
    number: z.number().int().min(1).max(26),
    theme: z.enum([
      'foundations',
      'running-the-business',
      'venues-money-and-property',
      'brand-culture-and-safety',
    ]),
    // `background-verify` chapters show a "Background chapter" label.
    status: z.enum(['sourced', 'background-verify']),
    asOf: z.coerce.date(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string(),
          url: z.url(),
          accessed: z.coerce.date(),
        }),
      )
      .default([]),
  }),
});

// The dated corrections log.
const updates = defineCollection({
  loader: glob({ base: './src/content/updates', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { writing, chapters, updates };
