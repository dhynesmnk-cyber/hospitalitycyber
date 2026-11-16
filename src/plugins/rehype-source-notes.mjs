// Turns [^1], [^2] ... in a page's text into numbered references, and puts a short note for each
// source beside the paragraph that first cites it (in the right margin on wide screens, under the
// paragraph on narrow ones). The note is built from the page's `sources` frontmatter, so the
// source list, the notes and the references can never disagree.
//
// The build fails if a reference points at a source that is not listed.

const MARK = /\[\^(\d+)\]/g;

const long = (value) => {
  const d = new Date(value);
  const part = (opts) => d.toLocaleDateString('en-AU', { ...opts, timeZone: 'UTC' });
  return `${part({ day: 'numeric' })} ${part({ month: 'long' })} ${part({ year: 'numeric' })}`;
};

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

function hasMark(node) {
  if (node.type === 'text') return new RegExp(MARK.source).test(node.value);
  return (node.children ?? []).some(hasMark);
}

// Replaces the markers inside `node` with <sup> references. Returns the numbers found, in order.
function replaceMarks(node, found) {
  const out = [];
  for (const child of node.children ?? []) {
    if (child.type === 'text' && new RegExp(MARK.source).test(child.value)) {
      let last = 0;
      for (const m of child.value.matchAll(MARK)) {
        if (m.index > last) out.push(text(child.value.slice(last, m.index)));
        const n = Number(m[1]);
        found.push(n);
        out.push(
          el('sup', { className: ['ref'] }, [
            el('a', { href: `#src-${n}`, ariaLabel: `Source ${n}` }, [text(String(n))]),
          ]),
        );
        last = m.index + m[0].length;
      }
      if (last < child.value.length) out.push(text(child.value.slice(last)));
    } else {
      if (child.children) replaceMarks(child, found);
      out.push(child);
    }
  }
  node.children = out;
}

function noteFor(n, source) {
  const doc = `${source.short ?? source.title}${source.section ? `, ${source.section}` : ''}.`;
  const dates = `${source.dated}. Read ${long(source.accessed)}.`;
  return el('p', { className: ['note'], role: 'note' }, [
    el('span', { className: ['note-n'] }, [text(String(n))]),
    text(' '),
    el('span', { className: ['note-doc'] }, [text(doc)]),
    text(' '),
    el('span', { className: ['note-dates'] }, [text(dates)]),
  ]);
}

// Makes a plain Markdown table behave like the designed tables: it scrolls instead of breaking
// the page, and on a narrow screen each row stacks, with the column heading shown beside each value.
function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function stackTable(table) {
  const headings = [];
  const walkRows = (node, fn) => {
    for (const child of node.children ?? []) {
      if (child.type !== 'element') continue;
      if (child.tagName === 'tr') fn(child);
      else walkRows(child, fn);
    }
  };
  for (const section of table.children) {
    if (section.type === 'element' && section.tagName === 'thead') {
      walkRows(section, (tr) => {
        tr.children.filter((c) => c.type === 'element').forEach((th) => headings.push(textOf(th).trim()));
      });
    }
  }
  for (const section of table.children) {
    if (section.type === 'element' && section.tagName === 'tbody') {
      walkRows(section, (tr) => {
        tr.children
          .filter((c) => c.type === 'element')
          .forEach((cell, i) => {
            if (i === 0) {
              cell.tagName = 'th';
              cell.properties = { ...cell.properties, scope: 'row' };
            } else {
              cell.properties = { ...cell.properties, dataLabel: headings[i] ?? '' };
            }
          });
      });
    }
  }
  table.properties = { ...table.properties, className: ['t-stack'] };
  return el('div', { className: ['table-wrap'] }, [table]);
}

export default function rehypeSourceNotes() {
  return (tree, file) => {
    const sources = file.data?.astro?.frontmatter?.sources ?? [];
    const shown = new Set();

    const walk = (parent) => {
      parent.children.forEach((node, i) => {
        if (node.type !== 'element') return;
        if (node.tagName === 'table') {
          parent.children[i] = stackTable(node);
        } else if (node.tagName === 'p' && hasMark(node)) {
          const found = [];
          replaceMarks(node, found);
          const fresh = [...new Set(found)].filter((n) => !shown.has(n));
          for (const n of found) {
            if (!sources[n - 1]) {
              throw new Error(`${file.path}: reference [^${n}] has no matching entry in sources.`);
            }
          }
          if (fresh.length) {
            fresh.forEach((n) => shown.add(n));
            parent.children[i] = el('div', { className: ['noted'] }, [
              node,
              el('div', { className: ['notes'] }, fresh.map((n) => noteFor(n, sources[n - 1]))),
            ]);
          }
        } else {
          walk(node);
        }
      });
    };
    walk(tree);

    const unused = sources.map((_, i) => i + 1).filter((n) => !shown.has(n));
    // A source that is listed but never cited is allowed only if it is also cited later in a
    // bare reference; otherwise it is an error, so the list never carries an orphan.
    if (unused.length && sources.length) {
      const cited = new Set();
      const scan = (n) => {
        if (n.type === 'element' && n.tagName === 'a' && /^#src-\d+$/.test(n.properties?.href ?? '')) {
          cited.add(Number(n.properties.href.slice(5)));
        }
        (n.children ?? []).forEach(scan);
      };
      scan(tree);
      const orphans = unused.filter((n) => !cited.has(n));
      if (orphans.length) {
        throw new Error(`${file.path}: sources ${orphans.join(', ')} are listed but never cited.`);
      }
    }
  };
}
