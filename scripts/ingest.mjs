#!/usr/bin/env node
// Converts one raw chapter into a content file: src/content/chapters/NN-slug.md
//
//   node scripts/ingest.mjs 05
//   CHAPTER_SOURCE=/path/to/raw/chapters node scripts/ingest.mjs 05
//
// This is a first conversion only. The new file is a draft with no sources, so it stays out of
// production builds until the research pass: add `sources`, put [^1] markers in the text, set
// `draft: false` and `status: sourced`. The script will not overwrite an existing chapter file
// unless you pass --force, because that would discard the research pass.
//
// Chapter 27 is private and is refused. A "Blog angles" section is dropped (it is pitch material).

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const force = args.includes('--force');
const numberArg = args.find((a) => /^\d{1,2}$/.test(a));
if (!numberArg) {
  console.error('Usage: node scripts/ingest.mjs <chapter number> [--force]');
  process.exit(1);
}
const number = Number(numberArg);
if (number === 27) {
  console.error('Chapter 27 is private and is never published.');
  process.exit(1);
}
if (number < 1 || number > 26) {
  console.error('Chapters 01 to 26 only. The hub (00) becomes the About text, not a chapter.');
  process.exit(1);
}

const source = process.env.CHAPTER_SOURCE ?? join(homedir(), 'Hospitality');
const prefix = String(number).padStart(2, '0');
const file = readdirSync(source).find((f) => f.startsWith(`${prefix} `) && f.endsWith('.md'));
if (!file) {
  console.error(`No raw chapter starting "${prefix} " in ${source}.`);
  process.exit(1);
}

const raw = readFileSync(join(source, file), 'utf8').replace(/\r\n/g, '\n');
const lines = raw.split('\n');

const heading = lines.find((l) => l.startsWith('# '));
const title = heading
  .replace(/^#\s+\d+\s+/, '')
  .replace(/\s+/g, ' ')
  .trim();

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Everything after the heading, minus the byline line ("Nov 13, 2026 · @David Hynes").
let body = lines.slice(lines.indexOf(heading) + 1);
body = body.filter((l) => !/^\w{3}\s+\d{1,2},\s+\d{4}\s+·/.test(l.trim()));

// Drop "Blog angles" through to the next heading of the same level, or the end.
const out = [];
let skipping = false;
for (const line of body) {
  if (/^##\s+/.test(line)) skipping = /^##\s+Blog angles/i.test(line);
  if (!skipping) out.push(line);
}
const text = out.join('\n').replace(/\n{3,}/g, '\n\n').trim();

// The first paragraph is the one-line summary.
const first = text.split('\n\n')[0].replace(/\s+/g, ' ').trim();
const description = first.length <= 155 ? first : first.slice(0, 152).replace(/\s+\S*$/, '') + '...';

const theme =
  number <= 7
    ? 'foundations'
    : number <= 17
      ? 'running-the-business'
      : number <= 22
        ? 'venues-money-and-property'
        : 'brand-culture-and-safety';

// The first paragraph moves into the page header, so it does not repeat in the body.
const rest = text.split('\n\n').slice(1).join('\n\n');

const quote = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const today = new Date().toISOString().slice(0, 10);

const front = [
  '---',
  `title: ${quote(title)}`,
  `description: ${quote(description)}`,
  `slug: ${slug}`,
  `number: ${number}`,
  `theme: ${theme}`,
  'status: background-verify',
  `asOf: ${today}`,
  'draft: true',
  'related: []',
  'sources: []',
  '---',
  '',
].join('\n');

const dir = join('src', 'content', 'chapters');
mkdirSync(dir, { recursive: true });
const target = join(dir, `${prefix}-${slug}.md`);
if (existsSync(target) && !force) {
  console.error(`${target} already exists. It may hold the research pass. Use --force only to start again.`);
  process.exit(1);
}
writeFileSync(target, `${front}\n${rest}\n`);
console.log(`Wrote ${target} (draft, no sources).`);
