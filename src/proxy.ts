import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Verificación optimista (no es la autorización real — eso se revalida en el
// servidor dentro de cada página). Si Supabase no está configurado todavía,
// dejamos pasar: el dashboard funciona como demo pública mientras tanto. En
// cuanto se agreguen NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY,
// esta misma lógica empieza a exigir sesión real.
const supabaseConfigurado = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function proxy(request: NextRequest) {
  if (!supabaseConfigurado) return NextResponse.next();

  const tieneCookieDeSesion = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  if (!tieneCookieDeSesion) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
