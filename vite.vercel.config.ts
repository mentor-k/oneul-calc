import path from "node:path";
import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    alias: { "cloudflare:workers": path.resolve(process.cwd(), "vercel-cloudflare-workers-stub.ts") },
  },
  plugins: [vinext(), nitro()],
});
