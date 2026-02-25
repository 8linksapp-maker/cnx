// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel(),
    integrations: [
        react({
            jsxRuntime: 'automatic',
            jsxImportSource: 'react',
        }),
        tailwind(), 
        markdoc()
    ],
    // Reset Trigger: 2026-02-07 11:40
});
