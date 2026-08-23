import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { PRIVATE_ROUTES } from './lib/routes';

const isPrivateRoute = createRouteMatcher(
  PRIVATE_ROUTES.map((route) => `/${route}(.*)`),
);
const isPublicApiRoute = createRouteMatcher([
  '/api/analytics',
  '/api/profile-view',
  '/api/billing/webhook',
]);

export default clerkMiddleware(async (auth: any, req: any) => {
  // Protect all private routes - require authentication
  if (isPrivateRoute(req) && !isPublicApiRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
