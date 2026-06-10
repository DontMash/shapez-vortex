import { Glob } from "bun";
import { mkdir, rename } from "node:fs/promises";
import { join } from "node:path";

export async function processBuildings() {
  console.log("Processing buildings...");
  await mkdir("src/buildings", { recursive: true });

  const glob = new Glob("static/models/buildings/*.glb");
  const procs = [];

  for await (const file of glob.scan(".")) {
    console.log(`Processing ${file}`);
    const proc = Bun.spawn(
      [
        "bunx",
        "@threlte/gltf",
        file,
        "-s",
        "-k",
        "-P",
        "-t",
        "-u",
        "-r",
        "/models/buildings/",
      ],
      { stdout: "inherit", stderr: "inherit" },
    );
    procs.push(proc.exited);
  }

  await Promise.all(procs);

  // Move and fix files
  const svelteGlob = new Glob("*.svelte");
  for await (const file of svelteGlob.scan(".")) {
    const dest = join("src/buildings", file);
    await rename(file, dest);
    await fixSnippetType(dest);
  }

  // Process root models (like Error.gltf)
  console.log("Processing root models...");
  await mkdir("src", { recursive: true });

  const rootGlob = new Glob("static/models/*.gltf");
  const rootProcs = [];

  for await (const file of rootGlob.scan(".")) {
    console.log(`Processing ${file}`);
    const proc = Bun.spawn(
      [
        "bunx",
        "@threlte/gltf",
        file,
        "-s",
        "-k",
        "-P",
        "-t",
        "-u",
        "-r",
        "/models/",
      ],
      { stdout: "inherit", stderr: "inherit" },
    );
    rootProcs.push(proc.exited);
  }

  await Promise.all(rootProcs);

  for await (const file of svelteGlob.scan(".")) {
    const dest = join("src", file);
    await rename(file, dest);
    await fixSnippetType(dest);
  }
}

async function fixSnippetType(filePath: string) {
  const file = Bun.file(filePath);
  if (await file.exists()) {
    let content = await file.text();
    content = content.replace(
      /Snippet<\[\{ ref: THREE\.Group \}\]>/g,
      "Snippet<[{ ref: THREE.Group | undefined }]>",
    );
    content = content.replace(/context="module"/g, "module");
    await Bun.write(filePath, content);
  }
}
