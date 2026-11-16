// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeSourceNotes from './src/plugins/rehype-source-notes.mjs';

// https://astro.build/config
export default defineConfig({
  // The only place the site URL is set. Pages read it through Astro.site.
  site: 'https://goodpotatoes.netlify.app',
  trailingSlash: 'always',
  // Astro 7 reads Markdown with Satteri by default. The source-notes plugin is a rehype plugin,
  // so Markdown goes through the unified processor instead.
  markdown: {
    processor: unified({ rehypePlugins: [rehypeSourceNotes] }),
  },
});
