import { Glob } from 'bun';
import { basename, extname } from 'node:path';

export async function generateIndex() {
  console.log('Generating src/index.ts...');
  const glob = new Glob('src/**/*.svelte');
  const exports: string[] = [];

  for await (const file of glob.scan('.')) {
    const relativePath = file.replace(/^src\//, './');
    const name = basename(file, extname(file));
    
    // Handle specific names like Error.svelte -> ErrorModel
    const exportName = name === 'Error' ? 'ErrorModel' : name;
    
    exports.push(`export { default as ${exportName} } from '${relativePath}';`);
  }

  // Sort exports alphabetically for consistency
  exports.sort();

  const indexContent = exports.join('\n') + '\n';
  await Bun.write('src/index.ts', indexContent);
  console.log('Generated src/index.ts successfully.');
}
