# ix-dev.com

Astro site. One shared content layer, several shells (see `src/`):

```
src/content/     shared facts (YAML) + schemas in content.config.ts: the single source of truth
src/boring/      the static "boring version" (Phase 1)
src/headunit/    desktop head-unit shell (Phase 2+)
src/companion/   phone shell (Phase 5)
```

## Commands

| Command | Does |
| --- | --- |
| `npm install` | install deps (Node 22, see `.nvmrc`) |
| `npm run dev` | dev server on :4321 |
| `npm run build` | static build into `dist/` |
| `npm run check` | type-check (needs TypeScript 6; `astro check` doesn't support TS 7 yet) |
| `npm run todos` | list every visible TODO badge in `dist/` |
| `npm run todos -- --strict` | same, but exit 1 if any remain: run before publishing |

## Editing content

Edit the YAML in `src/content/`. Never invent a fact: put what's missing in that entry's `todos`
list and it renders as a visible amber badge. Delete the `todos` line once the fact is filled in.

## Deploy (Cloudflare Pages)

Framework preset **Astro**, build command `npm run build`, output directory `dist`,
env var `NODE_VERSION=22`. `public/_headers` sets security and cache headers.
