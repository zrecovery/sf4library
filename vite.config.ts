import solid from "solid-start/vite";
import { defineConfig } from "vite";
import suidPlugin from "@suid/vite-plugin";

export default defineConfig({
    plugins: [solid(), suidPlugin()],
    build: {
        target: "esnext",
    },
});
