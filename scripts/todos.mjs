// Lists every unfilled fact in the content layer (src/content/*.yaml `todos:` entries).
// `npm run todos` prints them; `npm run todos -- --strict` exits 1 if any remain (use before publishing).
//
// Reads the content, not dist/: the TODO badges render in dev only, so they never reach a
// production build — the content files stay the single source of truth for what's missing.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content';
const found = [];

for (const name of readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) {
  const lines = readFileSync(join(dir, name), 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*todos:\s*$/.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length; j++) {
      const item = lines[j].match(/^\s*-\s+(.*\S)\s*$/);
      if (!item) break;
      found.push(`${name}: ${item[1].replace(/^["']|["']$/g, '')}`);
    }
  }
}

if (found.length === 0) console.log('No TODOs left.');
else {
  console.log(`${found.length} TODO(s) still unfilled:\n` + found.map((f) => `  - ${f}`).join('\n'));
  if (process.argv.includes('--strict')) process.exit(1);
}
