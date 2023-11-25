import { defineConfig } from 'vite';
import solid from "solid-start/vite";
import suidPlugin from "@suid/vite-plugin";
import solidStyled from "vite-plugin-solid-styled";


export default defineConfig({
  plugins: [
    suidPlugin(),
    solid({ ssr: false }),
    solidStyled({
      filter: {
        include: "src/**/*.tsx",
        exclude: "node_modules/**/*.{ts,js}",
      },
    }),
  ],
  build: {
    sourcemap: true
  }
});

