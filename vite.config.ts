import { defineConfig } from "vite";
import solidPlugin from 'vite-plugin-solid';
import suidPlugin from "@suid/vite-plugin";
import path from 'path';

export default defineConfig({
    plugins: [suidPlugin(), solidPlugin()],
    build: {
        target: "esnext",
        sourcemap: true
    },
    resolve:{
        alias:{
            '@': path.resolve(__dirname, './src')
        }
    }
});
