import { defineConfig } from "@solidjs/start/config";
import suidPlugin from "@suid/vite-plugin";
import solidStyled from "vite-plugin-solid-styled";
import unocssPlugin from "unocss/vite";

export default defineConfig({
    start: {
        ssr: false,
        server: {
            preset: "vercel-edge"
        }
    },
    plugins: [
        unocssPlugin(),
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
});

