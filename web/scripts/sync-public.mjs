/**
 * Copies the homepage's assets from the static site at the repo root into
 * web/public. The root files stay the single source of truth, so these copies
 * are gitignored and refreshed on every dev/build run.
 *
 * Only files the Next homepage actually references are copied. Unchanged files
 * are skipped so the ~78MB of showcase video is written once, not every run.
 */

import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = resolve(webRoot, "..");
const publicRoot = join(webRoot, "public");

/** Files copied 1:1, relative to the repo root. */
const FILES = [
  "images/usmaan-logo-mark.png",
  "images/home-rented-showcase.webp",
  "images/home-nmya-showcase.webp",
  "images/home-wcm-showcase.webp",
  "images/WCM-Main-Display.webp",
  "images/WCM-Dashboard-Card.webp",
  "images/WCM-Appointment-Components.webp",
  "images/WCM-Navigation-Components.webp",
  "images/WCM-Meds-Component.webp",
  "video/NMYA-Video-Display.mov",
  "video/Adsum-SS26-Vid.mov",
  "video/OTRS-Final-Display.mov",
  "shared/rented-prototype.html",
  "shared/rented-prototype.js",
  "shared/rented-prototype.css",
  "Favicon.png",
  "iOS Icon.png",
  "Usmaan-Razzaq-Resume.pdf",
];

/** Directories copied wholesale, relative to the repo root. */
const DIRS = ["images/rented-proto"];

async function statOrNull(path) {
  try {
    return await stat(path);
  } catch {
    return null;
  }
}

/** Skips the copy when the destination already matches size and mtime. */
async function isUpToDate(from, to) {
  const [src, dest] = await Promise.all([statOrNull(from), statOrNull(to)]);
  if (!src || !dest) return false;
  return src.size === dest.size && src.mtimeMs <= dest.mtimeMs;
}

async function copyFile(relativePath) {
  const from = join(siteRoot, relativePath);
  const to = join(publicRoot, relativePath);

  if (!(await statOrNull(from))) {
    console.warn(`[sync-public] missing source, skipped: ${relativePath}`);
    return 0;
  }
  if (await isUpToDate(from, to)) return 0;

  await mkdir(dirname(to), { recursive: true });
  await cp(from, to);
  return 1;
}

async function copyDir(relativePath) {
  const from = join(siteRoot, relativePath);
  if (!(await statOrNull(from))) {
    console.warn(`[sync-public] missing source dir, skipped: ${relativePath}`);
    return 0;
  }

  const entries = await readdir(from, { withFileTypes: true });
  const files = entries
    // AppleDouble sidecars on the external drive are not real assets.
    .filter((entry) => entry.isFile() && !entry.name.startsWith("._"))
    .map((entry) => join(relativePath, entry.name));

  const results = await Promise.all(files.map(copyFile));
  return results.reduce((total, copied) => total + copied, 0);
}

const counts = await Promise.all([...FILES.map(copyFile), ...DIRS.map(copyDir)]);
const copied = counts.reduce((total, count) => total + count, 0);

console.log(
  copied > 0
    ? `[sync-public] copied ${copied} asset(s) into web/public`
    : "[sync-public] assets already up to date",
);
