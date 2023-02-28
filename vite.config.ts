/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

// vite.config.js

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
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
        ],
        server: {
            port: 3000,
        },
        test: {
            environment: 'happy-dom',
        },
    };
});
