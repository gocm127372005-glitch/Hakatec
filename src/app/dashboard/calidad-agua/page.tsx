import { Droplets, FlaskConical } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { Etiqueta } from "@/components/dashboard/Etiqueta";
import { GraficaCalidadAgua } from "@/components/GraficaCalidadAgua";
import { humedalesAltoAtoyac } from "@/data/humedales";
import { crearClienteSupabaseServidor, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  COLOR_ESTADO_LECTURA,
  COLUMNAS_LECTURA_SENSOR,
  ETIQUETA_ESTADO_LECTURA,
  type EstadoLectura,
  type LecturaSensor,
} from "@/lib/sensores";

export const metadata = { title: "Calidad del agua — Atoyac" };

export default async function CalidadAguaPage() {
  const conDatos = humedalesAltoAtoyac.filter((h) => h.agua !== null);
  const lecturas = await obtenerLecturasRecientes();
  const ultima = lecturas[0] ?? null;

  const PARAMETROS = [
    {
      nombre: "pH",
      unidad: "—",
      valor: ultima?.ph ?? null,
      decimales: 1,
      detalle: "Derivado del nivel de agua (simulado) hasta tener sensor de pH real.",
    },
    {
      nombre: "Turbidez",
      unidad: "NTU",
      valor: ultima?.turbidez_ntu ?? null,
      decimales: 0,
      detalle: "Derivado del nivel de agua (simulado) hasta tener sensor de turbidez real.",
    },
    {
      nombre: "Temperatura",
      unidad: "°C",
      valor: ultima?.temperatura_c ?? null,
      decimales: 1,
      detalle: "Lectura real del termistor NTC de la trampa ESP32.",
    },
    {
      nombre: "Conductividad",
      unidad: "µS/cm",
      valor: ultima?.conductividad_us_cm ?? null,
      decimales: 0,
      detalle: "Derivado del nivel de agua y la temperatura hasta tener sensor real.",
    },
    { nombre: "Sólidos disueltos totales", unidad: "mg/l", valor: null, decimales: 0, detalle: null },
    { nombre: "Oxígeno disuelto", unidad: "mg/l", valor: null, decimales: 0, detalle: null },
    {
      nombre: "Nivel de agua",
      unidad: "cm (diferencial)",
      valor: ultima?.distancia_cm ?? null,
      decimales: 0,
      detalle: "Simulado con una onda triangular hasta instalar el sensor ultrasónico real.",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Calidad del agua</h1>
        <p className="text-sm text-muted">
          Ningún parámetro se muestra como medido en tiempo real a menos que exista instrumentación real conectada.
        </p>
      </div>

      <Panel
        titulo="Parámetros contemplados"
        icono={FlaskConical}
        etiqueta={ultima ? "real" : "simulado"}
        fuenteEtiqueta={ultima ? "ESP32" : undefined}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PARAMETROS.map((p) => (
            <div key={p.nombre} className="rounded-lg border border-line bg-bg p-3">
              <p className="text-sm font-medium text-ink">{p.nombre}</p>
              <p className="text-xs text-muted">{p.unidad}</p>
              {p.valor != null ? (
                <>
                  <p className="mt-1 text-lg font-semibold text-ink">{Number(p.valor).toFixed(p.decimales)}</p>
                  <p className="text-[11px] text-muted">{p.detalle}</p>
                </>
              ) : (
                <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">Sin instrumentación todavía</p>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {lecturas.length > 0 && (
        <Panel titulo="Últimas lecturas de la trampa ESP32" icono={Droplets} etiqueta="real" fuenteEtiqueta="ESP32">
          <p className="mb-3 text-sm text-muted">
            Nivel, pH, turbidez y conductividad vienen del mismo nivel de agua
            (todavía simulado); temperatura es la lectura real del NTC.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase text-muted">
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Dispositivo</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Nivel (cm)</th>
                  <th className="py-2 pr-4">pH</th>
                  <th className="py-2 pr-4">Turbidez</th>
                  <th className="py-2 pr-4">Conductividad</th>
                  <th className="py-2 pr-4">Temp. (°C)</th>
                  <th className="py-2 pr-4">Buzzer</th>
                </tr>
              </thead>
              <tbody>
                {lecturas.map((l) => {
                  const estado = (l.estado as EstadoLectura) ?? "normal";
                  return (
                    <tr key={l.id} className="border-b border-line/50">
                      <td className="py-2 pr-4 text-muted">{new Date(l.creado_en).toLocaleString("es-MX")}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-ink">{l.dispositivo_id}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${COLOR_ESTADO_LECTURA[estado] ?? COLOR_ESTADO_LECTURA.normal}`}
                        >
                          {ETIQUETA_ESTADO_LECTURA[estado] ?? l.estado}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-ink">{l.distancia_cm?.toFixed(0) ?? "—"}</td>
                      <td className="py-2 pr-4 text-ink">{l.ph?.toFixed(1) ?? "—"}</td>
                      <td className="py-2 pr-4 text-ink">{l.turbidez_ntu?.toFixed(0) ?? "—"}</td>
                      <td className="py-2 pr-4 text-ink">{l.conductividad_us_cm?.toFixed(0) ?? "—"}</td>
                      <td className="py-2 pr-4 text-ink">{l.temperatura_c?.toFixed(1) ?? "—"}</td>
                      <td className="py-2 pr-4 text-ink">{l.alerta_buzzer ? "🔔" : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel titulo="Mediciones históricas in situ (reales)" icono={Droplets} etiqueta="real">
        <p className="mb-3 text-sm text-muted">
          No son lecturas de sensores en tiempo real: son mediciones de campo
          reportadas por INEGI (2019) en 2 de los 10 humedales. Se muestran
          como referencia histórica, con fecha y fuente.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase text-muted">
                <th className="py-2 pr-4">Humedal</th>
                <th className="py-2 pr-4">pH</th>
                <th className="py-2 pr-4">Conductividad (mS/cm)</th>
                <th className="py-2 pr-4">STD (mg/l)</th>
                <th className="py-2 pr-4">O₂ disuelto (mg/l)</th>
                <th className="py-2 pr-4">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {conDatos.map((h) => (
                <tr key={h.id} className="border-b border-line/50">
                  <td className="py-2 pr-4 text-ink">{h.nombre}</td>
                  <td className="py-2 pr-4 text-ink">{h.agua?.pH}</td>
                  <td className="py-2 pr-4 text-ink">{h.agua?.conductividad_mS_cm}</td>
                  <td className="py-2 pr-4 text-ink">{h.agua?.solidosDisueltosTotales_mgL}</td>
                  <td className="py-2 pr-4 text-ink">{h.agua?.oxigenoDisuelto_mgL}</td>
                  <td className="py-2 pr-4 text-muted">{h.fuente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel titulo="Turbidez — serie simulada" icono={Droplets} etiqueta="simulado">
        <p className="mb-2 text-sm text-muted">
          Ejemplo de cómo se vería la gráfica una vez que el ESP32 envíe datos
          reales a Supabase. Sin filtros temporales todavía porque no hay
          datos reales que filtrar.
        </p>
        <GraficaCalidadAgua />
        <p className="mt-2 text-[11px] text-muted">
          <Etiqueta tipo="simulado" /> Datos de ejemplo, no provienen de ningún dispositivo.
        </p>
      </Panel>

      <p className="text-sm text-muted">
        ¿Por qué el agua está así? Ver{" "}
        <a href="/dashboard/causas" className="text-accent underline">
          causas documentadas de contaminación
        </a>{" "}
        (giros industriales, parámetros excedidos, fuentes citadas).
      </p>
    </div>
  );
}

async function obtenerLecturasRecientes(): Promise<LecturaSensor[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lecturas_sensores")
    .select(COLUMNAS_LECTURA_SENSOR)
    .order("creado_en", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as unknown as LecturaSensor[];
}
