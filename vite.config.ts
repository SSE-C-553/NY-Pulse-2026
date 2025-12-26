import { defineConfig } from "vite";

export default defineConfig(() => {
  const base = process.env.VITE_BASE || "/";
  return { base };
});

