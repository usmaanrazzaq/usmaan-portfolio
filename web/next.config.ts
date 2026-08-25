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
};

export default nextConfig;
