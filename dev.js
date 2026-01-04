import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { reloadClients, withHtmlLiveReload } from "bun-html-live-reload";
import { buildProject } from './build.js';

watch(resolve(__dirname, './src'), { recursive: true }, async (event, filename) => {
  console.log(`Rebuilding because of ${event} in ${filename}`);
  await buildProject();
  reloadClients();
});

console.log('Serving on http://localhost:3000');

Bun.serve({
  port: 3000,
  fetch: withHtmlLiveReload(async (request) => {
    const url = new URL(request.url);
    if (url.pathname === '/')
      url.pathname = '/index.html';

    const html = await Bun.file(`dist${url.pathname}`).text();

    let contentType = 'text/html';

    if (url.pathname.endsWith('.css')) {
      contentType = 'text/css';
    } else if (url.pathname.endsWith('.js')) {
      contentType = 'application/javascript';
    }

    return new Response(html, {
      headers: {
        'Content-Type': contentType,
      },
    });
  }),
});
