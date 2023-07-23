import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
        "/",
        "/api/trpc/posts.getAll",
        "/api/trpc/posts.create",
    ],
    ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/posts/clk4fstfa0001rrl9feu4wfn1"]
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
