import { defineConfig } from 'vite'
import suidPlugin from "@suid/vite-plugin";
import solidStyled from "vite-plugin-solid-styled";
import solidPlugin from 'vite-plugin-solid';
import unocssPlugin from "unocss/vite";
import presetUno from '@unocss/preset-uno'
import * as path from 'path';

export default defineConfig({
    plugins: [
        unocssPlugin({
            presets: [
                presetUno(),
            ]
        }),
        solidPlugin(),
        suidPlugin(),
        solidStyled({
            filter: {
                include: "src/**/*.tsx",
                exclude: "node_modules/**/*.{ts,js}",
            }
        }),
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
        sourcemap: true
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

