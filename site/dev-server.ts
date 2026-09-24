import { serve } from "bun";

const server = serve({
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    const file = Bun.file(`./src${path}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response(Bun.file("./src/index.html"));
  },

  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Dev server running at ${server.url}`);
