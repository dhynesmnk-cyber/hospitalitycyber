// Turns "chapter 11" and "chapters 11 and 17" in a page's text into links to those chapters.
//
// A number becomes a link only when that chapter is published (or visible in a draft view:
// `npm run dev`, or a build with SHOW_DRAFTS=1). A reference to a chapter that is not out stays as
// plain text, so a live page never links to a page that does not exist. A chapter does not link
// to itself.
//
// Astro caches rendered Markdown per entry. After a chapter is published, clear `.astro` and
// `node_modules/.astro` so the pages that mention it are rendered again. A clean build (Netlify)
// always does.

import { readdirSync, readFileSync } from 'node:fs';

const DIR = new URL('../content/chapters/', import.meta.url);
const SKIP = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style']);
// "Chapter 5", "chapters 11 and 17", "Chapters 02, 05 and 08".
const PHRASE = /\b([Cc]hapters?)\s+(\d{1,2}(?!\d)(?:\s*(?:,|and|or)\s*\d{1,2}(?!\d))*)/g;

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

function visibleChapters() {
  const showDrafts = process.env.SHOW_DRAFTS === '1' || process.argv.includes('dev');
  const map = new Map();
  for (const name of readdirSync(DIR)) {
    if (!name.endsWith('.md')) continue;
    const raw = readFileSync(new URL(name, DIR), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const number = Number(fm.match(/^number:\s*(\d+)/m)?.[1]);
    const slug = fm.match(/^slug:\s*(\S+)/m)?.[1];
    const title = fm.match(/^title:\s*"(.*)"/m)?.[1] ?? '';
    const draft = /^draft:\s*true/m.test(fm);
    if (!number || !slug) continue;
    if (draft && !showDrafts) continue;
    map.set(number, { slug, title });
  }
  return map;
}

// Returns the replacement nodes for a piece of text, or null when nothing in it should change.
function linkify(value, chapters, self) {
  const out = [];
  let last = 0;
  let touched = false;
  for (const m of value.matchAll(PHRASE)) {
    const parts = m[2].split(/(\d{1,2})/);
    const nodes = [];
    let any = false;
    for (const part of parts) {
      const n = Number(part);
      if (/^\d{1,2}$/.test(part) && chapters.has(n) && n !== self) {
        const c = chapters.get(n);
        nodes.push(el('a', { href: `/chapters/${c.slug}/`, ariaLabel: `Chapter ${n}: ${c.title}` }, [text(part)]));
        any = true;
      } else if (part) {
        nodes.push(text(part));
      }
    }
    if (!any) continue;
    touched = true;
    out.push(text(value.slice(last, m.index) + m[1] + ' '), ...nodes);
    last = m.index + m[0].length;
  }
  if (!touched) return null;
  out.push(text(value.slice(last)));
  return out;
}

function walk(node, chapters, self) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      const replaced = linkify(child.value, chapters, self);
      if (replaced) next.push(...replaced);
      else next.push(child);
    } else {
      if (child.type !== 'element' || !SKIP.has(child.tagName)) walk(child, chapters, self);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypeChapterLinks() {
  return (tree, file) => {
    const self = Number(file.data?.astro?.frontmatter?.number) || null;
    walk(tree, visibleChapters(), self);
  };
}
