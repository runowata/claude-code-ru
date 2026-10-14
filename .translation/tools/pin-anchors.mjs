// Pins each heading's English slug as an explicit <a id>, so links keep working
// after the heading is translated. H1: anchor at the end of the H1 line (lesson-lint
// wants the H1 on line 1); other headings: on the line above. Idempotent.
// Usage: node .translation/tools/pin-anchors.mjs file.md ...
import { readFileSync, writeFileSync } from 'node:fs';
import { slug } from '../../.github/scripts/lib/markdown.mjs';

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const ANCHOR = /<a\s[^>]*?\b(?:id|name)\s*=\s*["']([^"']+)["']/gi;

for (const file of process.argv.slice(2)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  const seen = new Map();
  let fence = null, added = 0;
  for (const line of lines) {
    const f = line.match(FENCE);
    if (fence) { if (f && f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null; out.push(line); continue; }
    if (f) { fence = f[1]; out.push(line); continue; }
    const atx = line.match(ATX);
    if (!atx) { out.push(line); continue; }
    const base = slug(atx[2] ?? '');
    const n = seen.get(base) ?? 0; seen.set(base, n + 1);
    const id = n === 0 ? base : `${base}-${n}`;
    const prev = out[out.length - 1] ?? '';
    const has = (s) => [...s.matchAll(ANCHOR)].some((m) => m[1] === id);
    if (!id || has(prev) || has(line)) { out.push(line); continue; }
    if (atx[1] === '#') out.push(`${line} <a id="${id}"></a>`);
    else { out.push(`<a id="${id}"></a>`, line); }
    added++;
  }
  writeFileSync(file, out.join('\n'));
  if (added) console.log(`${file}: +${added}`);
}
