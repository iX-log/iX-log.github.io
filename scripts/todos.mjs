// Lists every visible TODO badge in the built site (dist/).
// `npm run todos` prints them; `npm run todos -- --strict` exits 1 if any remain (use before publishing).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const found = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) {
      for (const m of readFileSync(path, 'utf8').matchAll(/data-todo[^>]*>([^<]*)</g)) found.push(`${path}: ${m[1].trim()}`);
    }
  }
};
try { walk(root); } catch { console.error('No dist/ found. Run `npm run build` first.'); process.exit(2); }

if (found.length === 0) console.log('No TODOs left.');
else {
  console.log(`${found.length} TODO(s) still visible:\n` + found.map((f) => `  - ${f}`).join('\n'));
  if (process.argv.includes('--strict')) process.exit(1);
}
