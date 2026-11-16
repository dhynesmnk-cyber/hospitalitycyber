// Site-wide values. The site URL is not here: it is set once in astro.config.mjs.
export const site = {
  name: 'Good Potatoes',
  author: 'David Hynes',
  description: 'Good Potatoes, written by David Hynes.',
  email: 'd.hynes.mnk@gmail.com',
  portfolioUrl: 'https://davehynes.netlify.app',
  // The one sentence shown above every signup box. Settled in the About draft, 14 November 2026.
  signupLine:
    'What the AI and software vendors in your venues’ systems say about your group’s data, read from their own terms and dated.',
  byline: 'Good Potatoes, written by David Hynes. One person, no sponsors, no affiliate links.',
  // Substack addresses. Empty until the publication is set up. While formUrl is empty the
  // signup form is shown switched off, with a plain note, so nothing posts to nowhere.
  newsletter: {
    formUrl: '' as string,
    publicationUrl: '' as string,
  },
  // While false, every page carries a noindex robots tag. Set to true at launch.
  indexable: false,
} as const;
