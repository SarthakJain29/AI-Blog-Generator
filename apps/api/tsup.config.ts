import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: '.dist',
    target: 'node18',
    // Only bundle in production (not dev) to avoid resolution issues
    external: process.env.NODE_ENV === 'production' ? [] : ['@prescription-ai/utils'],
});
