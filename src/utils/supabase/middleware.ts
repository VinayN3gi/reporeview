import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect "/" and any other pages unless they are signin/signup/auth callback/favicon
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isAuthCallback = pathname.startsWith("/auth");
  const isFavicon = pathname === "/favicon.ico";

  if (!user && !isAuthPage && !isAuthCallback && !isFavicon) {
    // User is not logged in, redirect to signin
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    // User is logged in, redirect to home
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
