#!/usr/bin/env node
// Copy lint. Holds every published word to the Good Potatoes writing rules (the copywriting
// prompt, sections 4 to 6 and 9). It runs first in `npm run build`, so a broken rule fails the
// build on Netlify as well as on this machine.
//
//   node scripts/lint-copy.mjs            lint everything
//   node scripts/lint-copy.mjs --quiet    print errors only (no warnings)
//   node scripts/lint-copy.mjs --counts   also print each article's word count
//
// What it reads: Markdown in src/content (frontmatter title, description, standfirst and
// TL;DR lines, plus the body) and the visible strings in src/pages, src/components, src/layouts
// and src/config/site.ts.
//
// Quoted text (between curly or straight double quotes) is a vendor's or a regulator's own
// words, and a quote is never altered, so wording rules do not apply inside quotes. An em dash
// inside a quote is reported as a warning to check, not an error.
//
// Rules that apply to articles (src/content/writing) only: tier word count, a three-line TL;DR
// whose first line starts "My read:", the three marked sections in order with the paste-ready one
// last, and an opening of 100 words or fewer. A draft (`draft: true` or a .draft.md file) gets those as warnings, so a
// piece can be worked on; every other rule is an error in drafts too.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOR_LEAD, UNCERTAINTY, PASTE } from '../src/config/sections.mjs';

const root = process.env.LINT_ROOT ?? fileURLToPath(new URL('..', import.meta.url));
const quiet = process.argv.includes('--quiet');
const showCounts = process.argv.includes('--counts');
const counts = [];

const errors = [];
const warnings = [];

function report(list, file, line, rule, excerpt) {
  list.push({ file: relative(root, file), line, rule, excerpt: excerpt.replace(/\s+/g, ' ').trim().slice(0, 110) });
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

// ---- Rules ---------------------------------------------------------------------------------

const BANNED_WORDS = [
  [/\bdelv(?:e|es|ed|ing)\b/i, 'delve'],
  [/\blandscape\b/i, 'landscape'],
  [/\bgame[- ]?changer\b/i, 'game-changer'],
  [/\bunlock(?:s|ed|ing)?\b/i, 'unlock'],
  [/\bseamless(?:ly)?\b/i, 'seamless'],
  [/\brobust(?:ly|ness)?\b/i, 'robust'],
  [/in today(?:'|’)s fast-paced world/i, "in today's fast-paced world"],
  [/here(?:'|’)s the thing/i, "here's the thing"],
  [/let that sink in/i, 'let that sink in'],
  [/make no mistake/i, 'make no mistake'],
  [/at the end of the day/i, 'at the end of the day'],
  // Vendor vocabulary in the writer's own voice (allowed only inside a quote).
  [/\bsupercharg(?:e|es|ed|ing)\b/i, 'supercharge'],
  [/\btransform(?:s|ed|ing|ation|ative)?\b/i, 'transform'],
  [/\bAI[- ]powered\b/i, 'AI-powered'],
  // Heat. Contempt is carried by the dated quote, never by an adjective (prompt section 3).
  [/\b(?:shameless(?:ly)?|staggering(?:ly)?|outrageous(?:ly)?|scandalous(?:ly)?|appalling(?:ly)?|egregious(?:ly)?)\b/i, 'adjective doing the work of evidence'],
  [/\b(?:robbed|robbing|ripped off|ripping off|rip-off)\b/i, 'telling readers they are being robbed'],
];

// "It's not X, it's Y" and variants. The period form is a warning because it can be innocent.
const NOT_X_Y = [
  [/\b(?:it|this|that)(?:'|’)s not\b[^.!?\n]{1,90}?[,;]\s*(?:it|this|that)(?:'|’)s\b/i, 'error'],
  [/\b(?:is|are|was|were) not\b[^.!?\n]{1,90}?[,;]\s*(?:it|this|that|they) (?:is|are|was|were)\b/i, 'error'],
  [/\b(?:isn(?:'|’)t|aren(?:'|’)t)\b[^.!?\n]{1,90}?[,;]\s*(?:it|this|that|they)(?:'|’)s\b/i, 'error'],
  [/\bnot (?:just|only|merely|simply)\b[^.!?\n]{1,90}?\bbut\b/i, 'error'],
  [/\b(?:it|this|that)(?:'|’)s not\b[^.!?\n]{1,90}?\.\s+(?:it|this|that)(?:'|’)s\b/i, 'warning'],
];

// American spellings. The site uses Australian English. Quotes are exempt.
const US_SPELLING =
  /\b(?:colors?|colored|behaviors?|centers?|centered|organizations?|organize[sd]?|optimiz(?:e|es|ed|ing|ation)|analyz(?:e|es|ed|ing)|favorites?|labor|neighbors?|neighborhoods?|realiz(?:e|es|ed)|recogniz(?:e|es|ed)|prioritiz(?:e|es|ed)|customiz(?:e|es|ed)|summariz(?:e|es|ed)|authoriz(?:e|es|ed|ation)|standardiz(?:e|es|ed)|defense|gray|catalogs?)\b/i;

const EMOJI = /[\p{Extended_Pictographic}--[©®™]]/v;

// ---- Text preparation ----------------------------------------------------------------------

// Replace every match with spaces (newlines kept), so character offsets and line numbers hold.
function blank(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
}

function lineOf(text, index) {
  let n = 1;
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) n += 1;
  return n;
}

// Quoted spans: curly pairs and straight pairs that do not run across a paragraph.
const QUOTE_SPANS = /“[^”]*”|"[^"\n]*"/g;

function quotedAndOutside(masked) {
  const quoted = [...masked.matchAll(QUOTE_SPANS)].map((m) => ({ index: m.index, text: m[0] }));
  return { outside: blank(masked, QUOTE_SPANS), quoted };
}

function checkStyle(file, masked, { checkExclamation = true } = {}) {
  const { outside, quoted } = quotedAndOutside(masked);

  for (const m of outside.matchAll(/—/g)) report(errors, file, lineOf(masked, m.index), 'em dash', masked.slice(Math.max(0, m.index - 40), m.index + 40));
  for (const q of quoted) {
    const at = q.text.indexOf('—');
    if (at >= 0) report(warnings, file, lineOf(masked, q.index), 'em dash inside a quote (check the source, do not alter the quote)', q.text);
  }

  for (const [re, name] of BANNED_WORDS) {
    const m = outside.match(re);
    if (m) report(errors, file, lineOf(masked, m.index), `banned: ${name}`, masked.slice(Math.max(0, m.index - 30), m.index + 50));
  }

  for (const [re, level] of NOT_X_Y) {
    const m = outside.match(re);
    if (m) report(level === 'error' ? errors : warnings, file, lineOf(masked, m.index), `"it's not X, it's Y" pattern`, m[0]);
  }

  // "Imagine" and "picture this" open a sentence or a paragraph.
  for (const m of outside.matchAll(/(?:^|[.!?:]\s+|\n\s*)(imagine|picture this)\b/gi)) {
    report(errors, file, lineOf(masked, m.index + m[0].length - m[1].length), 'banned opening: imagine / picture this', masked.slice(m.index, m.index + 60));
  }

  if (checkExclamation) {
    for (const m of outside.matchAll(/!/g)) report(errors, file, lineOf(masked, m.index), 'exclamation mark', masked.slice(Math.max(0, m.index - 40), m.index + 10));
  }

  const emoji = outside.match(EMOJI);
  if (emoji) report(errors, file, lineOf(masked, emoji.index), 'emoji', masked.slice(Math.max(0, emoji.index - 20), emoji.index + 20));

  const us = outside.match(US_SPELLING);
  if (us) report(errors, file, lineOf(masked, us.index), `American spelling: ${us[0]}`, masked.slice(Math.max(0, us.index - 30), us.index + 40));
  // The site writes "per cent".
  const pc = outside.match(/\bpercent\b/i);
  if (pc) report(warnings, file, lineOf(masked, pc.index), 'write "per cent"', masked.slice(Math.max(0, pc.index - 30), pc.index + 40));
}

// ---- Markdown content ----------------------------------------------------------------------

const COPY_KEYS = new Set(['title', 'description', 'standfirst', 'tldr']);

function splitMarkdown(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { front: '', frontEnd: 0, body: raw };
  return { front: m[1], frontEnd: m[0].length, body: raw.slice(m[0].length) };
}

function frontValue(front, key) {
  const m = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return undefined;
  return m[1].trim().replace(/^(["'])(.*)\1$/, '$2');
}

function frontList(front, key) {
  const lines = front.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (start < 0) return [];
  const items = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const m = lines[i].match(/^\s+-\s+(.*)$/);
    if (!m) break;
    items.push(m[1].trim().replace(/^(["'])(.*)\1$/, '$2'));
  }
  return items;
}

// Keep only the frontmatter lines that are copy; blank the rest (sources, dates, slugs).
function maskFrontmatter(raw, frontEnd) {
  const head = raw.slice(0, frontEnd);
  let keep = false;
  const masked = head
    .split('\n')
    .map((line, i) => {
      if (i === 0 || line === '---') return line.replace(/./g, ' ');
      const top = line.match(/^([A-Za-z]\w*):/);
      if (top) keep = COPY_KEYS.has(top[1]);
      if (!keep) return line.replace(/./g, ' ');
      // Drop the YAML quote marks that wrap a value, so they do not read as a quotation.
      return line.replace(/^(\s*(?:-\s+)?(?:\w+:\s+)?)(["'])(.*)\2\s*$/, (_, pre, _q, inner) => `${pre} ${inner} `);
    });
  return masked.join('\n');
}

function maskBody(body) {
  let text = body;
  text = blank(text, /\[\^\d+\]/g); // footnote markers
  text = blank(text, /<[^>]+>/g); // html tags (their text stays)
  text = blank(text, /\]\([^)\n]*\)/g); // link targets
  text = blank(text, /<!--[\s\S]*?-->/g);
  return text;
}

function wordCount(body) {
  const text = maskBody(body)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[|>*_`]/g, ' ')
    .replace(/^\s*[-:]+\s*$/gm, ' ');
  return (text.match(/\S+/g) ?? []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

const TIERS = { brief: [600, 1000], 'deep-dive': [2000, 3500] };

function lintMarkdown(file) {
  const raw = readFileSync(file, 'utf8');
  const { front, frontEnd, body } = splitMarkdown(raw);
  const isDraft = file.endsWith('.draft.md') || frontValue(front, 'draft') === 'true';
  const isWriting = file.includes(`${join('src', 'content', 'writing')}`);
  const structure = isDraft ? warnings : errors;

  // Markers that must never reach public content.
  if (!isDraft) {
    for (const m of raw.matchAll(/\[(?:ANECDOTE|DAVID|VERIFY|TODO)\b[^\]]*\]?/g)) {
      report(errors, file, lineOf(raw, m.index), 'unresolved marker in published content', m[0]);
    }
  }

  const title = frontValue(front, 'title') ?? '';
  if (title.trim().endsWith('?')) report(errors, file, 1, 'question headline', title);
  // Same limits as the content schema, reported here with the file and a clear message.
  if (title.length > 60) report(errors, file, 1, `title is ${title.length} characters (limit 60)`, title);
  const desc = frontValue(front, 'description') ?? '';
  if (desc.length > 155) report(errors, file, 1, `description is ${desc.length} characters (limit 155)`, desc);

  // Style rules over the copy: frontmatter copy keys, then the body, offsets kept.
  const masked = maskFrontmatter(raw, frontEnd).slice(0, frontEnd) + maskBody(body);
  checkStyle(file, masked);

  if (!isWriting) return;

  // Article structure.
  const tier = frontValue(front, 'tier');
  const words = wordCount(body);
  counts.push({ file, tier: tier ?? '?', words });
  if (!tier || !TIERS[tier]) {
    report(structure, file, 1, 'tier must be brief or deep-dive', `tier: ${tier ?? '(missing)'}`);
  } else {
    const [lo, hi] = TIERS[tier];
    if (words < lo || words > hi) report(structure, file, 1, `${tier} is ${lo} to ${hi} words`, `this piece is ${words} words`);
  }

  // The TL;DR: exactly three plain lines. The first is the key takeaway and starts "My read:".
  const tldr = frontList(front, 'tldr');
  if (tldr.length !== 3) {
    report(structure, file, 1, 'the TL;DR needs exactly three lines', `found ${tldr.length}`);
  } else if (!tldr[0].startsWith('My read:')) {
    report(structure, file, 1, 'the first TL;DR line is the key takeaway and must start "My read:"', tldr[0]);
  }

  // The standfirst is plain context: what happened and why it matters, in a sentence or two.
  // Provenance (what was read, when, that quotes are verbatim) lives under Sources, not here.
  const standfirst = frontValue(front, 'standfirst') ?? '';
  if (!standfirst.trim()) {
    report(structure, file, 1, 'the standfirst is missing: add one or two plain sentences of context', '');
  } else {
    if (/\b(?:read on|word for word|accessed)\b/i.test(standfirst)) {
      report(structure, file, 1, 'the standfirst is context, not provenance: the sources list carries read dates', standfirst);
    }
    const n = wordCount(standfirst);
    if (n > 50) report(structure, file, 1, 'the standfirst is over 50 words', `${n} words`);
  }

  const headings = [...body.matchAll(/^## (.+?)\s*$/gm)].map((m) => ({ text: m[1], index: m.index }));
  const order = [FOR_LEAD, UNCERTAINTY, PASTE];
  const positions = order.map((name) => headings.findIndex((h) => h.text === name));
  order.forEach((name, i) => {
    if (positions[i] < 0) report(structure, file, 1, 'missing marked section', `## ${name}`);
  });
  if (positions.every((p) => p >= 0)) {
    if (!(positions[0] < positions[1] && positions[1] < positions[2])) {
      report(structure, file, 1, 'marked sections out of order', `${FOR_LEAD}, then ${UNCERTAINTY}, then ${PASTE}`);
    }
    if (positions[2] !== headings.length - 1) report(structure, file, 1, 'the paste-ready section must close the piece', `## ${PASTE} is not the last section`);
    const tail = body.slice(headings[positions[2]].index);
    if (!/^>\s/m.test(tail)) report(structure, file, 1, 'paste-ready section needs a block quote to paste', `## ${PASTE}`);
  }

  // Opening: the claim and the stakes inside 100 words, before the first subhead.
  const firstHeading = headings[0]?.index ?? body.length;
  const opening = wordCount(body.slice(0, firstHeading));
  if (opening === 0) report(structure, file, 1, 'no opening before the first subhead', '');
  else if (opening > 100) report(structure, file, 1, 'opening is over 100 words', `${opening} words before the first subhead`);
}

// ---- Astro pages, components, layouts and site config --------------------------------------

function literals(code) {
  return [...code.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)]
    .map((m) => m[1] ?? m[2] ?? m[3])
    .filter((s) => /\s/.test(s) && /[A-Za-z]{3}/.test(s) && !/^[./#@\w-]+$/.test(s));
}

function lintAstro(file) {
  const raw = readFileSync(file, 'utf8');

  // Em dashes are checked in the whole file: none belongs in code comments either.
  for (const m of raw.matchAll(/—/g)) report(errors, file, lineOf(raw, m.index), 'em dash', raw.slice(Math.max(0, m.index - 40), m.index + 40));

  let code = '';
  let markup = raw;
  if (file.endsWith('.astro')) {
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (fm) {
      code = fm[1];
      markup = blank(raw, /^---\n[\s\S]*?\n---\n?/);
    }
    markup = blank(markup, /<script[\s\S]*?<\/script>/g);
    markup = blank(markup, /<style[\s\S]*?<\/style>/g);
    markup = blank(markup, /<!--[\s\S]*?-->/g);
    markup = blank(markup, /<!doctype[^>]*>/gi);
  } else {
    code = raw;
    markup = '';
  }

  // Page titles and descriptions written straight into a page: under 60 and 155 characters.
  for (const m of raw.matchAll(/^\s+(title|description)="([^"]*)"/gm)) {
    const limit = m[1] === 'title' ? 60 : 155;
    if (m[2].length > limit) report(errors, file, lineOf(raw, m.index), `${m[1]} is ${m[2].length} characters (limit ${limit})`, m[2]);
  }

  // Attribute values with real words (title="...", description="...").
  const attrs = [...markup.matchAll(/\b(?:title|description|alt|aria-label|line|label)="([^"]{8,})"/g)].map((m) => m[1]);
  // Text between tags, with {expressions} removed.
  let text = markup;
  // Blank {expressions} that hold no markup, then the stray braces and "!" of JS around markup
  // (such as {!live && ...}). A real exclamation mark is followed by a space or a tag.
  for (let i = 0; i < 4; i += 1) text = blank(text, /\{[^{}<>]*\}/g);
  text = text.replace(/[{}]/g, ' ').replace(/!(?=[A-Za-z_(])/g, ' ');
  text = text.replace(/<[^>]+>/g, ' ');

  const joined = [...literals(code), ...attrs, text].join('\n');
  checkStyle(file, joined);
}

// ---- Run -----------------------------------------------------------------------------------

const contentDir = join(root, 'src', 'content');
const markdown = walk(contentDir).filter((f) => f.endsWith('.md'));
const sourceFiles = [
  ...walk(join(root, 'src', 'pages')),
  ...walk(join(root, 'src', 'components')),
  ...walk(join(root, 'src', 'layouts')),
  join(root, 'src', 'config', 'site.ts'),
].filter((f) => /\.(astro|ts)$/.test(f));

for (const file of markdown) lintMarkdown(file);
for (const file of sourceFiles) lintAstro(file);

const print = (list, tag) => {
  for (const r of list) console.log(`${tag} ${r.file}:${r.line}  ${r.rule}${r.excerpt ? `\n      ${r.excerpt}` : ''}`);
};
if (showCounts) for (const c of counts) console.log(`words   ${relative(root, c.file)}  ${c.tier}  ${c.words}`);
print(errors, 'error  ');
if (!quiet) print(warnings, 'warning');

console.log(
  `\nCopy lint: ${markdown.length} content files, ${sourceFiles.length} page and config files. ${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`,
);
process.exit(errors.length ? 1 : 0);
