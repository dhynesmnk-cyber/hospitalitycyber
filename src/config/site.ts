// Site-wide values. The site URL is not here: it is set once in astro.config.mjs.
export const site = {
  name: 'Good Potatoes',
  author: 'David Hynes',
  description: 'Good Potatoes, written by David Hynes.',
  email: 'd.hynes.mnk@gmail.com',
  portfolioUrl: 'https://davehynes.netlify.app',
  // The one sentence shown above every signup box. David's choice, 17 November 2026: the pieces
  // are the same here and on Substack, and both are free. (The masthead byline was removed the
  // same day: the footer already says who writes the site.)
  signupLine: 'Read it here or get it by email. Same pieces, both free.',
  // Substack addresses. Empty until the publication is set up. While formUrl is empty the
  // signup form is shown switched off, with a plain note, so nothing posts to nowhere.
  newsletter: {
    formUrl: '' as string,
    publicationUrl: '' as string,
  },
  // While false, every page carries a noindex robots tag. Set to true at launch.
  indexable: false,
} as const;
