# Good Potatoes

Source for Good Potatoes, a site by David Hynes about the software that runs hospitality venues in Australia. It is a static site built with Astro and deployed on Netlify.

## Requirements

Node 22.23.4 or later (`.nvmrc` pins 22.23.5) and npm.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run check` | Type-check the project, including content frontmatter |
| `npm run build` | Type-check, then build the site into `dist/` |
| `npm run preview` | Serve the built site locally |

## Structure

| Path | Contents |
| --- | --- |
| `astro.config.mjs` | Astro settings. The site URL is set here and nowhere else |
| `src/config/site.ts` | Site name, author, contact details, newsletter addresses and the `indexable` switch |
| `src/content.config.ts` | Content collections and their frontmatter rules |
| `src/content/writing/` | Articles |
| `src/content/chapters/` | Chapters of the Hospitality Tools Resource |
| `src/content/updates/` | Dated corrections |
| `src/layouts/Base.astro` | The page shell every page uses |
| `src/pages/` | Routes |

## Indexing

`indexable` in `src/config/site.ts` is `false` until launch, which puts a `noindex` robots tag on every page. A single page can also set `noindex` in its frontmatter.

## Drafts

Files ending in `.draft.md` are ignored by git. They render locally and are never pushed, so nothing unpublished reaches the repository or the live site.

## Dependencies

| Package | Why it is here |
| --- | --- |
| `astro` | The site generator. It also supplies Zod through `astro/zod`, so `zod` is not installed separately |
| `@astrojs/check` | Runs `astro check`, the type check that gates every build |
| `typescript` | Required by `@astrojs/check`. Held at version 6 because the checker does not yet support version 7 |

## Deploy

Netlify builds from `netlify.toml`: it runs `npm run build` and publishes `dist/`. The Node version for the build is set in the same file.
