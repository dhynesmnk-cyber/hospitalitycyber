// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeSourceNotes from './src/plugins/rehype-source-notes.mjs';
import rehypeChapterLinks from './src/plugins/rehype-chapter-links.mjs';

// https://astro.build/config
export default defineConfig({
  // The only place the site URL is set. Pages read it through Astro.site.
  site: 'https://goodpotatoes.netlify.app',
  trailingSlash: 'always',
  // Astro 7 reads Markdown with Satteri by default. The source-notes plugin is a rehype plugin,
  // so Markdown goes through the unified processor instead. The chapter-links plugin turns "chapter 11" into a link.
  markdown: {
    processor: unified({ rehypePlugins: [rehypeSourceNotes, rehypeChapterLinks] }),
  },
});
