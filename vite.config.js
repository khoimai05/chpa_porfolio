import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/chpa_porfolio/",
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
