import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The static site links with trailing slashes (/playground/, /rented/rented/),
  // so the Next routes have to resolve the same way.
  trailingSlash: true,

  // The static site at the repo root has its own lockfile, so the workspace
  // root has to be pinned to this app.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  experimental: {
    // This repo lives on an exFAT volume, which cannot store extended
    // attributes, so macOS writes an AppleDouble "._name" sidecar beside every
    // file. Turbopack's dev cache parses its own filenames as integers
    // (00000001.sst), chokes on "._00000001", and dies on startup with
    // "Failed to open database ... invalid digit found in string".
    // Safe to re-enable on APFS or Linux, where no sidecars are created.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
