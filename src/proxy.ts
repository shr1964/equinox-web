import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except API, Next internals, static files, Sanity Studio, and favicon
    "/((?!api|_next|_vercel|studio|.*\\..*).*)",
  ],
};
