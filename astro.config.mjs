import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.SITE_URL;
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL must be an absolute HTTP(S) URL.');

export default defineConfig({
  site: site || undefined,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
  build: { inlineStylesheets: 'auto' },
});
