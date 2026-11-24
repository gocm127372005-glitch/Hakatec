import { Info } from "lucide-react";
import { isSupabaseConfigured, obtenerUsuarioActual } from "@/lib/supabase/server";

export async function AuthBanner() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-300 sm:px-6">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Modo demostración: la autenticación real no está configurada todavía
        (faltan las variables de Supabase). Este dashboard es de acceso
        abierto mientras tanto — ver /dashboard/configuracion para detalles.
      </div>
    );
  }

  const usuario = await obtenerUsuarioActual();
  if (!usuario) return null;

  return (
    <div className="flex items-center gap-2 border-b border-line bg-accent/5 px-4 py-2 text-xs text-muted sm:px-6">
      <Info className="h-3.5 w-3.5 shrink-0" />
      Sesión iniciada como {usuario.email}
    </div>
  );
}
