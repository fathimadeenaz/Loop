import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoute = createRouteMatcher([
    "/",
    "/upcoming",
    "/meeting(.*)",
    "/previous",
    "/recordings",
    "/personal-room",
]);

export default clerkMiddleware(async (auth, request) => {
    if (protectedRoute(request))
        await auth.protect();
});

export
    const config = {
        matcher: [
            "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
            "/(api|trpc)(.*)",
        ],
    };