import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { buildProject } from './build.js';

watch(resolve(__dirname, './src'), { recursive: true }, async (event, filename) => {
  console.log(`Rebuilding because of ${event} in ${filename}`);
  await buildProject();
});

console.log('Serving on http://localhost:3000');

Bun.serve({
  port: 3000,
  fetch: async (request) => {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      url.pathname = '/index.html';
    }

    const html = await Bun.file(`dist${url.pathname}`).text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  },
});
