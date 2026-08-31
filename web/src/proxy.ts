import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Normalises the mixed-case URLs the site used to publish (/Rented,
 * /WCM-Connect, /On-The-Run-Studio, /National-Muslim-Youth-Association, and
 * the .html case-study suffix) onto today's all-lowercase, extensionless
 * routes.
 *
 * This cannot live in `redirects()` in next.config.ts: Next matches a
 * redirect's `source` case-insensitively, so a rule pointing /WCM-Connect at
 * /wcm-connect also matches its own destination and loops forever. (The old
 * vercel.json got away with it because Vercel's matcher is case-sensitive.)
 * The comparison below is case-sensitive, so an already-correct URL falls
 * through untouched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets have genuinely mixed-case filenames -- Favicon.png,
  // iOS Icon.png, WCM-Main-Display.webp -- and must never be lowercased.
  // Anything with an extension is a file, except the .html we mean to strip.
  const filename = pathname.split("/").pop() ?? "";
  if (filename.includes(".") && !filename.toLowerCase().endsWith(".html")) {
    return NextResponse.next();
  }

  const normalised = pathname.replace(/\.html$/i, "").toLowerCase();
  if (normalised === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = normalised;
  return NextResponse.redirect(url, 308);
}

/** Everything except the build output and the public/ asset directories. */
export const config = {
  matcher: ["/((?!_next/|images/|video/|shared/|hero/).*)"],
};
