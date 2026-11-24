"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ClipboardList, Waves, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const TIPOS = [
  "Basura acumulada en el río",
  "Descarga de aguas residuales",
  "Mal olor",
  "Lirio acuático / plantas invasoras",
  "Otro",
];

export default function ReportesCiudadanosPage() {
  const [enviado, setEnviado] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [ubicacion, setUbicacion] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <Link href="/login" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500">
            <Waves className="h-4.5 w-4.5 text-zinc-950" />
          </div>
          <span className="text-sm font-semibold">Atoyac · Reportes ciudadanos</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-xl px-6 py-10">
        <h1 className="text-xl font-semibold text-ink">Reportar un problema en el río</h1>
        <p className="mt-1 text-sm text-muted">
          Sección pública, independiente del panel de gestión. No pidas ni escribas datos personales sensibles aquí.
        </p>

        {!isSupabaseConfigured && (
          <div className="mt-4 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            <Info className="h-4 w-4 shrink-0" />
            Este formulario todavía no está conectado a una base de datos real
            — puedes probarlo, pero el reporte no se guarda hasta que se
            configure Supabase.
          </div>
        )}

        {enviado ? (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <p className="font-medium text-emerald-700 dark:text-emerald-300">
              {isSupabaseConfigured ? "Reporte recibido." : "Formulario validado (modo demostración)."}
            </p>
            <p className="mt-1 text-sm text-muted">
              {isSupabaseConfigured
                ? "Folio de seguimiento: se generará al conectar la base de datos."
                : "No se guardó en ningún lado — este despliegue aún no tiene base de datos conectada."}
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-6 space-y-4 rounded-xl border border-line bg-card p-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Tipo de problema</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Ubicación aproximada</label>
              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                required
                placeholder="Ej. puente sobre el río, calle X esquina Y"
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                minLength={10}
                rows={4}
                placeholder="Describe lo que observaste…"
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-muted">
              <ClipboardList className="h-3.5 w-3.5" />
              No incluyas tu nombre, teléfono ni otros datos personales.
            </p>
            <button
              type="submit"
              className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Enviar reporte
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
