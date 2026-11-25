"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Radio, MapPin } from "lucide-react";
import { crearClienteSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ETIQUETA_ESTADO, COLOR_ESTADO, type EstadoReporte } from "@/lib/reportes";

const MapaReportesPublico = dynamic(
  () => import("@/components/MapaReportesPublico"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted">
        Cargando mapa…
      </div>
    ),
  }
);

type Reporte = {
  id: string;
  folio: string;
  tipo: string;
  ubicacion_texto: string;
  lat: number | null;
  lng: number | null;
  fuente: string;
  estado: EstadoReporte;
  creado_en: string;
};

// Las coordenadas 0,0 son el valor de relleno que usa el flujo de WhatsApp
// cuando no se compartió una ubicación real (solo texto) — no un punto real.
function tieneUbicacionReal(r: Reporte): r is Reporte & { lat: number; lng: number } {
  return r.lat != null && r.lng != null && !(r.lat === 0 && r.lng === 0);
}

export function ReportesPublicosFeed() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = crearClienteSupabase();
    let activo = true;

    supabase
      .from("reportes")
      .select("id, folio, tipo, ubicacion_texto, lat, lng, fuente, estado, creado_en")
      .neq("estado", "borrador")
      .order("creado_en", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!activo) return;
        if (data) setReportes(data as Reporte[]);
        setCargando(false);
      });

    const canal = supabase
      .channel("reportes-publico")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reportes", filter: "estado=neq.borrador" },
        (payload) => {
          setReportes((prev) => [payload.new as Reporte, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "reportes", filter: "estado=neq.borrador" },
        (payload) => {
          const actualizado = payload.new as Reporte;
          setReportes((prev) => {
            const existe = prev.some((r) => r.id === actualizado.id);
            if (existe) return prev.map((r) => (r.id === actualizado.id ? actualizado : r));
            return [actualizado, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      activo = false;
      supabase.removeChannel(canal);
    };
  }, []);

  if (!isSupabaseConfigured) return null;

  const conUbicacion = reportes.filter(tieneUbicacionReal);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Radio className="h-4 w-4 text-emerald-500" />
          Reportes recientes (en vivo)
        </h2>
        <span className="text-xs text-muted">{reportes.length} reporte(s)</span>
      </div>

      <div className="h-64 overflow-hidden rounded-xl border border-line">
        {conUbicacion.length > 0 ? (
          <MapaReportesPublico reportes={conUbicacion} />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
            Aún no hay reportes con ubicación exacta compartida por WhatsApp.
            <br />
            Los reportes con solo descripción de ubicación aparecen en la lista de abajo.
          </div>
        )}
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-line bg-card p-3">
        {cargando ? (
          <p className="text-xs text-muted">Cargando reportes…</p>
        ) : reportes.length === 0 ? (
          <p className="text-xs text-muted">Aún no hay reportes públicos.</p>
        ) : (
          reportes.slice(0, 30).map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between gap-2 border-b border-line pb-2 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-muted">{r.folio}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ${COLOR_ESTADO[r.estado]}`}
                  >
                    {ETIQUETA_ESTADO[r.estado]}
                  </span>
                  <span className="text-[10px] text-muted">
                    {r.fuente === "whatsapp" ? "💬 WhatsApp" : "🌐 Web"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-ink">{r.tipo}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {r.ubicacion_texto}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted">
                {new Date(r.creado_en).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
