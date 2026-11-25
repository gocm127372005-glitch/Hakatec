import { Suspense } from "react";
import { Droplets, MapPinned, ShieldCheck, Waves, Cpu, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Reveal } from "@/components/Reveal";
import { GraficaCalidadAgua } from "@/components/GraficaCalidadAgua";
import { humedalesAltoAtoyac } from "@/data/humedales";
import MapaHumedales from "@/components/MapaHumedales3DClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Etiqueta } from "@/components/dashboard/Etiqueta";
import { Panel } from "@/components/dashboard/Panel";
import { crearClienteSupabaseServidor, isSupabaseConfigured } from "@/lib/supabase/server";
import { COLUMNAS_LECTURA_SENSOR, type LecturaSensor } from "@/lib/sensores";

export const metadata = { title: "Centro de operaciones — Atoyac" };

export default function CentroOperacionesPage() {
  const conDatosReales = humedalesAltoAtoyac.filter((h) => h.agua !== null);
  const sitiosRamsar = humedalesAltoAtoyac.filter((h) => h.sitioRamsar);
  const areaTotal = humedalesAltoAtoyac.reduce((acc, h) => acc + h.areaKm2, 0);

  return (
    <div className="space-y-4">
      {/* Fila 1: título, descripción, estado */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-ink">Centro de operaciones</h1>
            <p className="text-sm text-muted">
              Cuenca del Alto Atoyac · HackaTec Nacional 2026
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/20">
            Fuente: INEGI, 2019 (histórico)
          </span>
        </div>
      </Reveal>

      {/* Fila 2: 4 indicadores */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Waves} valor={String(humedalesAltoAtoyac.length)} etiqueta="Humedales identificados" detalle="INEGI, Alto Atoyac, 2019" acento="cyan" />
          <StatCard icon={Droplets} valor={String(conDatosReales.length)} etiqueta="Con medición in situ" detalle="pH, conductividad, STD, O₂" acento="emerald" />
          <StatCard icon={ShieldCheck} valor={String(sitiosRamsar.length)} etiqueta="Sitios RAMSAR" detalle="Importancia internacional" acento="cyan" />
          <StatCard icon={MapPinned} valor={`${areaTotal.toFixed(2)} km²`} etiqueta="Área total de humedales" detalle="Suma de los 10 sitios" acento="amber" />
        </div>
      </Reveal>

      {/* Fila 3: mapa 70% + alertas 30% */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
        <Reveal delay={0.1} className="lg:col-span-7">
          <section className="flex h-[420px] flex-col rounded-xl border border-line bg-card">
            <div className="flex items-center justify-between rounded-t-xl border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-medium text-ink">Mapa de humedales</h2>
              </div>
              <Etiqueta tipo="real" />
            </div>
            <div className="flex-1 overflow-hidden rounded-b-xl">
              <ErrorBoundary fallbackTitulo="El mapa no pudo cargar en este equipo.">
                <MapaHumedales />
              </ErrorBoundary>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-3">
          <Panel titulo="Alertas recientes" icono={ShieldCheck} etiqueta="simulado">
            <p className="text-sm text-muted">
              Sin alertas registradas. Aparecerán aquí cuando la trampa envíe
              datos reales a Supabase.
            </p>
          </Panel>
        </Reveal>
      </div>

      {/* Fila 4: calidad del agua + dispositivos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense fallback={<FilaCalidadFallback />}>
          <PanelesCalidadYDispositivos />
        </Suspense>
      </div>

      {/* Fila 5: inventario de humedales + actividad reciente */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Reveal delay={0.3}>
          <Panel titulo="Inventario de humedales" icono={Waves} etiqueta="real">
            <ul className="max-h-48 space-y-1 overflow-y-auto pr-1 text-sm">
              {humedalesAltoAtoyac.map((h) => (
                <li key={h.id} className="flex items-center justify-between rounded-md px-2 py-1.5 odd:bg-accent/5">
                  <span className="truncate text-ink/90">{h.nombre}</span>
                  <span className="shrink-0 text-xs text-muted">{h.areaKm2} km²</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
        <Reveal delay={0.35}>
          <Panel titulo="Actividad reciente" icono={Activity} etiqueta="simulado">
            <p className="text-sm text-muted">
              Sin actividad registrada todavía. El historial de auditoría
              empezará a llenarse cuando haya usuarios reales operando el
              sistema.
            </p>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}

function FilaCalidadFallback() {
  return (
    <>
      <Panel titulo="Calidad del agua — trampa ESP32" icono={Droplets} etiqueta="simulado">
        <p className="text-sm text-muted">Cargando…</p>
      </Panel>
      <Panel titulo="Dispositivos IoT" icono={Cpu} etiqueta="simulado">
        <p className="text-sm text-muted">Cargando…</p>
      </Panel>
    </>
  );
}

async function PanelesCalidadYDispositivos() {
  const ultimaLectura = await obtenerUltimaLectura();

  return (
    <>
      <Reveal delay={0.2}>
        <Panel
          titulo="Calidad del agua — trampa ESP32"
          icono={Droplets}
          etiqueta={ultimaLectura ? "real" : "simulado"}
          fuenteEtiqueta={ultimaLectura ? "ESP32" : undefined}
        >
          {ultimaLectura ? (
            <p className="mb-2 text-sm text-muted">
              Última lectura: {new Date(ultimaLectura.creado_en).toLocaleString("es-MX")} · Temp.{" "}
              {ultimaLectura.temperatura_c?.toFixed(1) ?? "—"}°C · pH {ultimaLectura.ph?.toFixed(1) ?? "—"} ·{" "}
              <a href="/dashboard/calidad-agua" className="text-accent underline">
                ver detalle
              </a>
            </p>
          ) : (
            <p className="mb-2 text-sm text-muted">Turbidez de ejemplo mientras se conecta el ESP32.</p>
          )}
          <GraficaCalidadAgua />
        </Panel>
      </Reveal>
      <Reveal delay={0.25}>
        <Panel
          titulo="Dispositivos IoT"
          icono={Cpu}
          etiqueta={ultimaLectura ? "real" : "simulado"}
          fuenteEtiqueta={ultimaLectura ? "ESP32" : undefined}
        >
          {ultimaLectura ? (
            <p className="text-sm text-muted">
              Trampa <span className="font-mono text-xs">{ultimaLectura.dispositivo_id}</span> enviando
              telemetría — ver{" "}
              <a href="/dashboard/dispositivos" className="text-accent underline">
                Dispositivos IoT
              </a>
              .
            </p>
          ) : (
            <p className="text-sm text-muted">
              0 dispositivos registrados. El módulo de dispositivos ESP32/LoRa
              está listo para recibirlos — ver{" "}
              <a href="/dashboard/dispositivos" className="text-accent underline">
                Dispositivos IoT
              </a>
              .
            </p>
          )}
        </Panel>
      </Reveal>
    </>
  );
}

async function obtenerUltimaLectura(): Promise<LecturaSensor | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("lecturas_sensores")
    .select(COLUMNAS_LECTURA_SENSOR)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as LecturaSensor;
}
