import { defineConfig } from "@solidjs/start/config";
import suidPlugin from "@suid/vite-plugin";
import solidStyled from "vite-plugin-solid-styled";
import unocssPlugin from "unocss/vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    start: {
        ssr: false,
        server: {
            preset: "vercel"
        }
    },
    plugins: [
        VitePWA({
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            base: "/",
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            manifest: {
                "name": "zrLib",
                "icons": [
                    {
                        "src": "icons/512.png",
                        "type": "image/png",
                        "sizes": "512x512"
                    }
                ],
                "start_url": "./",
                "scope": "./",
                "background_color": "#fff",
                "theme_color": "#fff"
            }
        }),
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

