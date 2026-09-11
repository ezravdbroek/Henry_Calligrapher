// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

/** Pages that used to live under /v2 while the redesign ran alongside the original site. */
const moved = [
  'services',
  'products',
  'previous-projects',
  'about',
  'petalia',
  'contact',
  'cookie-policy',
  'terms-and-conditions',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://henrycalligraphy.com',

  vite: {
    plugins: [tailwindcss()]
  },

  // The redesign replaced the original site and moved from /v2 to the root. Preview links
  // that were shared during review keep working.
  redirects: {
    '/v2': '/',
    ...Object.fromEntries(moved.map((page) => [`/v2/${page}`, `/${page}`])),
  },

  integrations: [sitemap()]
});
