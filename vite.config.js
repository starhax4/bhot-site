import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://bhots-server.vercel.app",
        changeOrigin: true,
        secure: true,
        // Optionally, rewrite the path if your backend expects a different base path
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
