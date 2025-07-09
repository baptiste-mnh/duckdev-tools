import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { dirname, join, resolve } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "package.json"), "utf-8")
);

// Production config optimized for GitHub Pages
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/duckdev-tools/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_VERSION": JSON.stringify(packageJson.version),
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["zustand", "lucide-react"],
        },
        // Optimize for GitHub Pages with proper hashing
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Ensure assets are properly hashed for cache busting
    assetsInlineLimit: 4096,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
