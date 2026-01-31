import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,                    // ✅ "true" allows ALL hosts (including Replit's dynamic one)
    port: 5000,
    hmr: {
      host: true,                  // ✅ "true" works for Replit HMR
      overlay: false,
    },
  },
}));
