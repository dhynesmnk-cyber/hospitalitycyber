// The three marked sections every article carries, by their exact heading text. The rehype plugin
// wraps each one in a marked container, and scripts/lint-copy.mjs requires them in this order,
// with the last one closing the piece. Keep the wording here and nowhere else.
export const FOR_LEAD = 'For your AI lead';
export const UNCERTAINTY = 'What this does not show';
export const PASTE = 'Put this in writing';

// What each marked section tells the reader about itself, shown above its text.
export const SECTION_KINDS = new Map([
  [FOR_LEAD, { className: 'for-lead', kicker: 'Implementation detail. A CEO can skip to the next section.' }],
  [PASTE, { className: 'paste-ready', kicker: 'Paste this into an email to the vendor.' }],
]);
