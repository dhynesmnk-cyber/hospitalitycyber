# Good Potatoes

Source for Good Potatoes, a site by David Hynes about the software that runs hospitality venues in Australia. It is a static site built with Astro and deployed on Netlify.

## Requirements

Node 22.23.4 or later (`.nvmrc` pins 22.23.5) and npm.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server. Drafts are shown |
| `npm run check` | Type-check the project, including content frontmatter |
| `npm run build` | Type-check, then build the site into `dist/`. Drafts are left out |
| `SHOW_DRAFTS=1 npm run build` | The same, with drafts included, for local review only |
| `npm run preview` | Serve the built site locally |
| `node scripts/ingest.mjs 05` | First conversion of raw chapter 05 into `src/content/chapters/` (see Chapters) |

## Structure

| Path | Contents |
| --- | --- |
| `astro.config.mjs` | Astro settings. The site URL is set here and nowhere else |
| `src/config/site.ts` | Site name, author, contact details, signup line, newsletter addresses and the `indexable` switch |
| `src/content.config.ts` | Content collections and their frontmatter rules |
| `src/content/writing/` | Articles |
| `src/content/chapters/` | Chapters of the Hospitality Tools Resource |
| `src/content/updates/` | Dated corrections |
| `src/layouts/` | `Base.astro` (the page shell) and `Piece.astro` (an article or chapter) |
| `src/components/` | Signup box, chapter list, contents list, date stamp |
| `src/plugins/rehype-source-notes.mjs` | Turns `[^1]` markers into numbered references and margin notes (see Sources) |
| `src/styles/` | `tokens.css` (colours) and `site.css` (layout and type) |
| `public/fonts/` | Self-hosted fonts and their licences |
| `scripts/ingest.mjs` | Converts a raw chapter into a content file |
| `src/pages/` | Routes |

## Design

Editorial and warm. Newsreader for titles and text, Libre Franklin for labels, margin notes and controls. Both are SIL Open Font Licence 1.1; the licence texts are in `public/fonts/`. Light by default, dark when the reader's system asks for it. Every text colour pair clears WCAG AA. A light and dark switch in the header lets the reader override the system setting; the choice is kept in the browser's localStorage and nothing is sent anywhere. Without JavaScript the switch is hidden and the system setting applies. The only scripts are the two small inline ones in `Base.astro`.

## Sources

Every article and chapter lists its sources in frontmatter, in the order they are first cited:

```yaml
sources:
  - title: "Payment Terms"
    publisher: "Square"
    url: "https://example.com/payment-terms"
    section: "section 13"          # optional
    short: "Payment Terms"         # optional shorter name for the margin note
    dated: "Last updated 1 October 2026"   # the date the document gives itself
    accessed: 2026-11-16           # the day it was read
```

In the text, cite a source with `[^1]`, `[^2]` and so on. The first citation puts a short note beside the paragraph (in the margin on wide screens), and the Sources list at the foot of the page is built from the same data. The build fails if a number has no matching source, or a listed source is never cited.

## Chapters

`scripts/ingest.mjs` makes a first conversion of a raw chapter (set `CHAPTER_SOURCE` to the folder that holds the raw files). The new file is a draft with no sources, so it stays out of production builds. The research pass then adds `sources`, `[^n]` markers, `draft: false` and `status: sourced`. The script will not overwrite an existing chapter file unless you pass `--force`, and it refuses chapter 27, which is private.

## Indexing

`indexable` in `src/config/site.ts` is `false` until launch, which puts a `noindex` robots tag on every page. A single page can also set `noindex` in its frontmatter.

## Drafts

Files ending in `.draft.md` are ignored by git. They render locally and are never pushed, so nothing unpublished reaches the repository or the live site. A draft file needs a `slug` in its frontmatter. Drafts are listed and built only by `npm run dev` or a build run with `SHOW_DRAFTS=1`; a normal build never includes an entry marked `draft: true`.

## Newsletter signup

The form posts to `newsletter.formUrl` in `src/config/site.ts`. While that is empty the form is shown switched off, with a plain note, so it never posts to nowhere.

## Dependencies

| Package | Why it is here |
| --- | --- |
| `astro` | The site generator. It also supplies Zod through `astro/zod`, so `zod` is not installed separately |
| `@astrojs/markdown-remark` | Astro 7 reads Markdown with its own faster processor by default. The source-notes plugin is a rehype plugin, which needs this unified processor |
| `@astrojs/check` | Runs `astro check`, the type check that gates every build |
| `typescript` | Required by `@astrojs/check`. Held at version 6 because the checker does not yet support version 7 |

## Deploy

Netlify builds from `netlify.toml`: it runs `npm run build` and publishes `dist/`. The Node version for the build is set in the same file.
