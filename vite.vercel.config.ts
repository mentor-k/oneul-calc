import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

export default defineConfig({
  css: { postcss: false },
  plugins: [vinext(), nitro()],
});
