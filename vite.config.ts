import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      server: { entry: "server" },
    }),
    viteReact(),
    tailwindcss(),
    tsconfigPaths(),
    // Nitro only bundles the production server (npm run build → .output/).
    // In dev it sits in front of Vite's module middleware and 404s .json
    // module requests (e.g. /src/data/house.json?import), which breaks route
    // hydration in real browsers, so it stays out of `vite dev`.
    ...(command === "build" ? [nitro()] : []),
  ],
}));
