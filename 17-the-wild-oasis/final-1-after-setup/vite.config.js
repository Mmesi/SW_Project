import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), nodePolyfills()],
  optimizeDeps: {
    include: ["sqlite3"],
  },
  define: {
    "process.env": {},
  },
});
