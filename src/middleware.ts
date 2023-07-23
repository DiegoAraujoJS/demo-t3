import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
        "/",
        "/api/trpc/posts.getAll",
        "/api/trpc/posts.create",
    ],
});
 
// ok
// Middleware matcher.
export const config = {
    matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
        "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
        "/"
    ],
}
