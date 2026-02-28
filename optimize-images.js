const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMAGE_DIRS = [
  path.join(__dirname, "images"),
  path.join(__dirname, "Contact", "assets"),
];

const EXTENSIONS = [".png", ".jpg", ".jpeg"];
const MAX_WIDTH = 2000;
const WEBP_QUALITY = 82;

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

async function optimizeDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Skipping missing directory: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    const inputPath = path.join(dir, file);
    const outputName = path.basename(file, ext) + ".webp";
    const outputPath = path.join(dir, outputName);

    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping (already exists): ${outputName}`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      const compressedSize = fs.statSync(outputPath).size;
      totalCompressed += compressedSize;

      const saving = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
      console.log(
        `  ${file} (${formatBytes(originalSize)}) → ${outputName} (${formatBytes(compressedSize)}) — ${saving}% smaller`
      );
    } catch (err) {
      console.error(`  ERROR processing ${file}:`, err.message);
    }
  }

  if (totalOriginal > 0) {
    const totalSaving = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);
    console.log(`\n  Total for ${path.basename(dir)}/:`);
    console.log(`    Before: ${formatBytes(totalOriginal)}`);
    console.log(`    After:  ${formatBytes(totalCompressed)}`);
    console.log(`    Saved:  ${totalSaving}%`);
  }
}

(async () => {
  console.log("Starting image optimization...\n");
  for (const dir of IMAGE_DIRS) {
    console.log(`\nProcessing: ${dir}`);
    await optimizeDir(dir);
  }
  console.log("\nDone!");
})();
