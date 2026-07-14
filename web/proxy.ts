import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/posts/new", "/posts/*/edit"];
const authPaths = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtected = protectedPaths.some((p) => {
    const pattern = new RegExp("^" + p.replace("*", "[^/]+") + "$");
    return pattern.test(pathname);
  });

  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/new", "/posts/:id/edit", "/login", "/register"],
};
