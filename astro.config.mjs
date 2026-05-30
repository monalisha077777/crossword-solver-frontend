import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static', // Astro 6: static by default, SSR only where prerender = false
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    cache: true, // Enable Cloudflare Cache API for SSR pages
  }),
  integrations: [svelte()],
});
