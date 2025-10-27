import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ Fully production-ready Vite config for Vercel
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // ensures correct routing after build
  build: {
    outDir: "dist",
    sourcemap: false, // disable source maps for smaller build
    chunkSizeWarningLimit: 1000,
    minify: "esbuild", // fast + efficient minification
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
