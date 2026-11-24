import { Settings, Server } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Configuración — Atoyac" };

export default function ConfiguracionPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Configuración del sistema</h1>
        <p className="text-sm text-muted">Estado real de los servicios — no simulado.</p>
      </div>

      <Panel titulo="Estado de servicios" icono={Server} etiqueta={isSupabaseConfigured ? "real" : "simulado"}>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-ink">Supabase (base de datos y auth)</span>
            <span className={isSupabaseConfigured ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
              {isSupabaseConfigured ? "Configurado" : "No configurado"}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-ink">Mapa (Esri, sin API key)</span>
            <span className="text-emerald-700 dark:text-emerald-300">Operativo</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-ink">Dispositivos ESP32</span>
            <span className="text-amber-700 dark:text-amber-300">Sin dispositivos conectados</span>
          </li>
        </ul>
        {!isSupabaseConfigured && (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            Para habilitar autenticación y datos reales: crea un proyecto en{" "}
            <a href="https://supabase.com" className="underline" target="_blank" rel="noreferrer">supabase.com</a>,
            activa Email Auth, y agrega <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en Vercel → Settings → Environment Variables. No existe
            ninguna clave privada expuesta en este proyecto.
          </div>
        )}
      </Panel>

      <Panel titulo="Preferencias de apariencia" icono={Settings} etiqueta="real">
        <p className="text-sm text-muted">
          El tema (claro/oscuro/automático) se controla desde el selector de la
          barra superior y persiste entre recargas.
        </p>
      </Panel>
    </div>
  );
}
