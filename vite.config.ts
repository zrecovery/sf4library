import { defineConfig } from 'vite'
import suidPlugin from "@suid/vite-plugin";
import solidPlugin from 'vite-plugin-solid';
import unocssPlugin from "unocss/vite";
import presetUno from '@unocss/preset-uno'
import { VitePWA } from 'vite-plugin-pwa'
import * as path from 'path';
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    plugins: [
        topLevelAwait({
            promiseExportName: "__tla",
            promiseImportName: i => `__tla_${i}`
          }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            }
        }),
        unocssPlugin({
            presets: [
                presetUno(),
            ]
        }),
        solidPlugin(),
        suidPlugin(),
        {
            name: "isolation",
            configureServer(server) {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                    next();
                });
            },
        },
    ],
    build: {
        sourcemap: true,
        target: 'esnext',
    },
    worker:{
        format: 'es',
    },
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
    optimizeDeps: {
        exclude: ['@sqlite.org/sqlite-wasm'],
    },
    resolve: {
        alias: [
            { find: '~', replacement: path.resolve(__dirname, 'src') },
        ],
    },
});

