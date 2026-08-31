import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The published URLs carry trailing slashes (/playground/, /rented/rented/),
  // inherited from the static site this app replaced. Keep them so the links
  // already out in the world keep resolving.
  trailingSlash: true,

  // The repo root has its own package.json (a thin script shim), so the
  // workspace root has to be pinned to this app.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  // The old site published /projects; it is /playground now.
  //
  // The other legacy URLs from the static site's vercel.json were case fixes
  // (/WCM-Connect, /Rented, ...). Those live in src/proxy.ts instead, because
  // Next matches a redirect `source` case-insensitively and such a rule would
  // match its own lowercase destination and loop.
  async redirects() {
    return [
      { source: "/projects", destination: "/playground", permanent: true },
      { source: "/projects/", destination: "/playground/", permanent: true },
    ];
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
