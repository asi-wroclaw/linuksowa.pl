import { resolve } from 'node:path';
import handlebars from 'bun-plugin-hbs';

import { context } from './src/data/context';

export async function buildProject() {
  const result = await Bun.build({
    entrypoints: [resolve(__dirname, 'src/index.html')],
    outdir: 'dist',
    plugins: [
      handlebars({
        context,
        partialDirectory: resolve(__dirname, 'src/partials'),
        helpers: {
          eq: (a, b) => a === b,
          lookup: (obj, key) => obj?.[key] || null,
          hasItems: (array) => Array.isArray(array) && array.length > 0,
          uppercase: (str) => str.toUpperCase(),
        },
      }),
    ],
  });

  copyFiles();

  if (result.success) {
    console.log('\x1b[32m%s\x1b[0m', 'Build complete.');
  } else {
    console.error('Build failed:', result.logs);
  }
}

async function copyFiles() {
  // fix for Bun.build not copying some static assets
  const ogSource = resolve(__dirname, 'src/assets/images/branding/open-graph.png');
  const ogDest = resolve(__dirname, 'dist/open-graph.png');

  const ogFile = Bun.file(ogSource);
  await Bun.write(ogDest, ogFile);

  const faviconSource = resolve(__dirname, 'src/assets/images/favicon.ico');
  const faviconDest = resolve(__dirname, 'dist/favicon.ico');

  const faviconFile = Bun.file(faviconSource);
  await Bun.write(faviconDest, faviconFile);
}

console.log('Building project...');

buildProject();
