import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Zod comes from Astro's own copy. Do not add `zod` to package.json.
import { z } from 'astro/zod';

// Shared by every page type. `draft` keeps an entry out of every list and out of production
// builds. `noindex` publishes it with a noindex robots tag.
const page = {
  title: z.string().max(60),
  description: z.string().max(155),
  draft: z.boolean().default(false),
  noindex: z.boolean().default(false),
};

// One source per numbered reference. The body cites it as [^1], [^2] and so on, in the order
// listed here. `dated` is the date the document gives itself, in the document's own words.
// `accessed` is the day it was read.
const source = z.object({
  title: z.string(),
  // A shorter name for the margin note. Falls back to the title.
  short: z.string().optional(),
  publisher: z.string(),
  url: z.url(),
  section: z.string().optional(),
  dated: z.string(),
  accessed: z.coerce.date(),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
  schema: z.object({
    ...page,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // The line under the headline. Falls back to the description.
    standfirst: z.string().optional(),
    // `brief` is 600 to 1,000 words, one claim. `deep-dive` is 2,000 to 3,500. scripts/lint-copy.mjs
    // holds each piece to its tier.
    tier: z.enum(['brief', 'deep-dive']),
    // The TL;DR, in plain language, exactly three lines. The first is the key takeaway: what the
    // author thinks it means, starting "My read:". The other two are the plain facts behind it.
    tldr: z.array(z.string().min(1)).length(3),
    // Chapter numbers this piece leans on, such as ['05']. Shown after the piece as background.
    chapters: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
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
    // Chapter numbers of related chapters, such as ['02', '11'].
    related: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
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
