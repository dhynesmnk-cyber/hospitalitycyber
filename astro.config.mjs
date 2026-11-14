// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The only place the site URL is set. Pages read it through Astro.site.
  site: 'https://hospitalitytech101.netlify.app',
  trailingSlash: 'always',
});
