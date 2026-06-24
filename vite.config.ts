import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

// Identificatore univoco della build: usato per l'auto-update della PWA.
// Viene iniettato nel bundle (__BUILD_ID__) e scritto in version.json:
// il client confronta i due valori e ricarica quando differiscono.
const BUILD_ID = String(Date.now());

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: "emit-version-json",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "version.json",
          source: JSON.stringify({ buildId: BUILD_ID }) + "\n",
        });
      },
    },
  ],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
