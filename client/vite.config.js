import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
// import path from "path";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// 1. Derive __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url); // :contentReference[oaicite:1]{index=1}
const __dirname = dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // port: 4000,
    host: true,
    open: true,


    // Enable HTTPS and point to the key & cert files you generated.
    // https: {
    //   key: fs.readFileSync(resolve(__dirname, "./localhost.key")),
    //   cert: fs.readFileSync(resolve(__dirname, "./localhost.crt")),
    // },
  },
  base: "/Hotel_Menu/",
  plugins: [react()],
});
