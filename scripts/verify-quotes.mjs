#!/usr/bin/env node
// Quote check. "Every quote is verbatim" (copywriting prompt, section 4b) as a machine check:
// every quotation of three words or more in an article or chapter must appear, word for word,
// in a saved copy of the source page.
//
//   node scripts/verify-quotes.mjs                 check every piece
//   node scripts/verify-quotes.mjs your-square-data   check one piece (a slug or a file name part)
//
// Saved copies ("snapshots") are plain-text files kept OUTSIDE this repository, because the
// repository is public and the files are other companies' pages. The default folder is
// ~/Hospitality/_work/snapshots. Set SNAPSHOT_DIR to use another. Name each file
// <vendor>/<document>-<YYYY-MM-DD>.txt so the day it was read is in the name.
//
// This runs on a machine that has the snapshots. It is not part of the Netlify build.
//
// How a quote is matched: curly and straight quote marks, dashes and spacing are normalised on
// both sides; case and wording are not. A quote with an ellipsis or a [bracketed insertion] is
// split at that point, and each part must appear, in order, in one snapshot. A snapshot is
// matched on any page, not on the one the footnote names, so read the report: it shows which
// snapshot matched each quote.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const snapshotDir = process.env.SNAPSHOT_DIR ?? join(homedir(), 'Hospitality', '_work', 'snapshots');
const only = process.argv.slice(2).find((a) => !a.startsWith('--'));

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const normalise = (s) =>
  s
    .normalize('NFKC')
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/[​-‍﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

if (!existsSync(snapshotDir)) {
  console.error(`No snapshot folder at ${snapshotDir}. Save each source page as plain text there first (see the header of this script).`);
  process.exit(1);
}

const snapshots = walk(snapshotDir)
  .filter((f) => f.endsWith('.txt'))
  .map((f) => ({ name: relative(snapshotDir, f), text: normalise(readFileSync(f, 'utf8')) }));

if (snapshots.length === 0) {
  console.error(`The snapshot folder ${snapshotDir} holds no .txt files.`);
  process.exit(1);
}

// Fragments of a quote: split at ellipses and [bracketed] insertions, trim edge punctuation.
function fragments(quote) {
  return normalise(quote)
    .split(/\s*(?:…|\.\.\.|\[[^\]]*\])\s*/)
    .map((f) => f.replace(/^[\s,.;:]+|[\s,.;:]+$/g, ''))
    .filter((f) => f.split(' ').length >= 2 || f.length >= 12);
}

function findSnapshot(quote) {
  const parts = fragments(quote);
  if (parts.length === 0) return undefined;
  return snapshots.find((s) => {
    let from = 0;
    for (const part of parts) {
      const at = s.text.indexOf(part, from);
      if (at < 0) return false;
      from = at + part.length;
    }
    return true;
  });
}

const files = [...walk(join(root, 'src', 'content', 'writing')), ...walk(join(root, 'src', 'content', 'chapters'))]
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !only || f.includes(only));

if (files.length === 0) {
  console.error(only ? `No piece matches "${only}".` : 'No content files found.');
  process.exit(1);
}

let total = 0;
let failed = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const quotes = [...body.matchAll(/“([^”]+)”/g)].map((m) => m[1]).filter((q) => q.trim().split(/\s+/).length >= 3);
  if (quotes.length === 0) continue;
  console.log(`\n${relative(root, file)}`);
  for (const q of quotes) {
    total += 1;
    const hit = findSnapshot(q);
    if (hit) {
      console.log(`  ok      “${q.slice(0, 70)}${q.length > 70 ? '…' : ''}”  <- ${hit.name}`);
    } else {
      failed += 1;
      console.log(`  MISSING “${q.slice(0, 100)}${q.length > 100 ? '…' : ''}”`);
    }
  }
}

console.log(`\nQuote check: ${total} quotations, ${total - failed} found word for word, ${failed} not found. ${snapshots.length} snapshot files.`);
process.exit(failed ? 1 : 0);
