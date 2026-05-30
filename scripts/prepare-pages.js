import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const CLIENT = join(DIST, 'client');
const SERVER = join(DIST, 'server');
const OUT = join(ROOT, 'pages-deploy');

// Clean
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });

// Copy static assets to root of deploy dir
cpSync(CLIENT, OUT, { recursive: true });

// Copy server code as _worker subdirectory
cpSync(SERVER, join(OUT, '_worker'), { recursive: true });

// Create _worker.js entry point
writeFileSync(join(OUT, '_worker.js'), `import worker from './_worker/entry.mjs';\nexport default worker;\n`);

// Create _routes.json - route all non-static requests to the worker
writeFileSync(join(OUT, '_routes.json'), JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: ['/_astro/*', '/favicon.ico', '/favicon.svg']
}, null, 2));

console.log('✅ Pages deployment ready in', OUT);
