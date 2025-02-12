/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        build: {
            manifest: 'asset-manifest.json',
            outDir: 'build',
        },
        plugins: [
            react(),
            svgr(),
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        VITE_DEKORATOREN_URL: env.VITE_DEKORATOREN_URL,
                    },
                },
            }),
            visualizer({
                filename: 'bundle-stats.html',
            }),
        ],
        server: {
            port: 3000,
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/setupTests.jsx'],
        },
    };
});
