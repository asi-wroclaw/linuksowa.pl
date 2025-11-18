import { resolve } from 'node:path';
import handlebars from 'bun-plugin-hbs';

export async function buildProject() {
  const result = await Bun.build({
    entrypoints: [ resolve(__dirname, 'src/index.html')],
    outdir: 'dist',
    plugins: [
      handlebars({
        context: {
          author: 'Michał Korczak',
          items: ['Naruto', 'Steins;Gate', 'Bleach', '...'],
        },
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

  if (result.success) {
    console.log('\x1b[32m%s\x1b[0m', 'Build complete.');
  } else {
    console.error('Build failed:', result.logs);
  }
}

console.log('Building project...');

buildProject();
