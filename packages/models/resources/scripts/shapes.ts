import { Glob } from 'bun';
import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

export async function processShapes() {
  console.log('Processing shapes...');
  await mkdir('src/shapes', { recursive: true });

  const glob = new Glob('static/models/shapes/*.gltf');
  const procs = [];

  for await (const file of glob.scan('.')) {
    console.log(`Processing ${file}`);
    const proc = Bun.spawn(
      ['bunx', '@threlte/gltf', file, '-k', '-P', '-t', '-u', '-r', '/models/shapes/'],
      { stdout: 'inherit', stderr: 'inherit' }
    );
    procs.push(proc.exited);
  }

  await Promise.all(procs);

  const svelteGlob = new Glob('*.svelte');
  for await (const file of svelteGlob.scan('.')) {
    const dest = join('src/shapes', file);
    await rename(file, dest);
    await fixSnippetType(dest);
  }
}

async function fixSnippetType(filePath: string) {
  const file = Bun.file(filePath);
  if (await file.exists()) {
    let content = await file.text();
    content = content.replace(/Snippet<\[\{ ref: THREE\.Group \}\]>/g, 'Snippet<[{ ref: THREE.Group | undefined }]>');
    await Bun.write(filePath, content);
  }
}
