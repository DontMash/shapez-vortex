import { processBuildings } from "./buildings";
import { processShapes } from "./shapes";
import { generateIndex } from "./generate-index";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "buildings":
      await processBuildings();
      break;
    case "shapes":
      await processShapes();
      break;
    case "index":
      await generateIndex();
      break;
    case "all":
      await processBuildings();
      await processShapes();
      await generateIndex();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(
        "Usage: bun run resources/scripts/pipeline.ts <buildings|shapes|index|all>",
      );
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error running pipeline:", err);
  process.exit(1);
});
