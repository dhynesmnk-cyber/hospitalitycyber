// Site-wide values. The site URL is not here: it is set once in astro.config.mjs.
export const site = {
  name: 'Good Potatoes',
  author: 'David Hynes',
  description: 'Good Potatoes, written by David Hynes.',
  email: 'd.hynes.mnk@gmail.com',
  portfolioUrl: 'https://davehynes.netlify.app',
  // Substack addresses. Empty until the publication is set up.
  newsletter: {
    formUrl: '',
    publicationUrl: '',
  },
  // While false, every page carries a noindex robots tag. Set to true at launch.
  indexable: false,
} as const;
