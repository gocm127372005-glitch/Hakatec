import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Cliente de Supabase para Server Components. Devuelve null si no hay
 * credenciales configuradas, en vez de lanzar error — así el resto de la
 * app puede tratarlo como "modo demostración" en lugar de romperse. */
export async function crearClienteSupabaseServidor() {
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Llamado desde un Server Component sin permiso de escritura;
          // el proxy ya se encarga de refrescar la sesión cuando aplica.
        }
      },
    },
  });
}

export async function obtenerUsuarioActual() {
  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
