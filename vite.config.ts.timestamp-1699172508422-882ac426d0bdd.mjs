// vite.config.ts
import { defineConfig } from "file:///Users/gaotianlun/Project/Program/sf4library/node_modules/vite/dist/node/index.js";
import solid from "file:///Users/gaotianlun/Project/Program/sf4library/node_modules/solid-start/vite/plugin.js";
import suidPlugin from "file:///Users/gaotianlun/Project/Program/sf4library/node_modules/@suid/vite-plugin/index.mjs";
import solidStyled from "file:///Users/gaotianlun/Project/Program/sf4library/node_modules/vite-plugin-solid-styled/dist/esm/production/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    suidPlugin(),
    solid({ ssr: false }),
    solidStyled({
      filter: {
        include: "src/**/*.tsx",
        exclude: "node_modules/**/*.{ts,js}"
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2FvdGlhbmx1bi9Qcm9qZWN0L1Byb2dyYW0vc2Y0bGlicmFyeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dhb3RpYW5sdW4vUHJvamVjdC9Qcm9ncmFtL3NmNGxpYnJhcnkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dhb3RpYW5sdW4vUHJvamVjdC9Qcm9ncmFtL3NmNGxpYnJhcnkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBzb2xpZCBmcm9tIFwic29saWQtc3RhcnQvdml0ZVwiO1xuaW1wb3J0IHN1aWRQbHVnaW4gZnJvbSBcIkBzdWlkL3ZpdGUtcGx1Z2luXCI7XG5pbXBvcnQgc29saWRTdHlsZWQgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkLXN0eWxlZFwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBzdWlkUGx1Z2luKCksXG4gICAgc29saWQoeyBzc3I6IGZhbHNlIH0pLFxuICAgIHNvbGlkU3R5bGVkKHtcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBpbmNsdWRlOiBcInNyYy8qKi8qLnRzeFwiLFxuICAgICAgICBleGNsdWRlOiBcIm5vZGVfbW9kdWxlcy8qKi8qLnt0cyxqc31cIixcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG59KTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVCxTQUFTLG9CQUFvQjtBQUNuVixPQUFPLFdBQVc7QUFDbEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsTUFBTSxFQUFFLEtBQUssTUFBTSxDQUFDO0FBQUEsSUFDcEIsWUFBWTtBQUFBLE1BQ1YsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
