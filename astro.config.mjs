// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://ix-dev.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [svelte(), sitemap({ filter: (page) => !page.includes('/404') })],
});
