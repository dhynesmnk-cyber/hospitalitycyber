import { getCollection, type CollectionEntry } from 'astro:content';

// Drafts show up only in `astro dev`, or in a build run with SHOW_DRAFTS=1 for local review.
// A normal `npm run build` (the one Netlify runs) never includes them. Draft files are also
// gitignored (*.draft.md), so a draft cannot reach the public repo by accident.
export const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === '1';

const visible = (entry: { data: { draft: boolean } }) => showDrafts || !entry.data.draft;

export async function getWriting(): Promise<CollectionEntry<'writing'>[]> {
  const all = (await getCollection('writing')).filter(visible);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getChapters(): Promise<CollectionEntry<'chapters'>[]> {
  const all = (await getCollection('chapters')).filter(visible);
  return all.sort((a, b) => a.data.number - b.data.number);
}

export async function getUpdates(): Promise<CollectionEntry<'updates'>[]> {
  const all = await getCollection('updates');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function chapterNumber(n: number): string {
  return String(n).padStart(2, '0');
}
