import { defineConfig } from 'vite';
import solid from "solid-start/vite";
import suidPlugin from "@suid/vite-plugin";
import solidStyled from "vite-plugin-solid-styled";
import unocssPlugin from "unocss/vite";

export default defineConfig({
    plugins: [
        unocssPlugin(),
        suidPlugin(),
        solid({ ssr: false }),
        solidStyled({
            filter: {
                include: "src/**/*.tsx",
                exclude: "node_modules/**/*.{ts,js}",
            }
        })
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
});

