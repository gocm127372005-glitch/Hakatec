import { Droplets, FlaskConical } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { Etiqueta } from "@/components/dashboard/Etiqueta";
import { GraficaCalidadAgua } from "@/components/GraficaCalidadAgua";
import { humedalesAltoAtoyac } from "@/data/humedales";

export const metadata = { title: "Calidad del agua — Atoyac" };

const PARAMETROS = [
  { nombre: "pH", unidad: "—", instrumentado: false },
  { nombre: "Turbidez", unidad: "NTU", instrumentado: false },
  { nombre: "Temperatura", unidad: "°C", instrumentado: false },
  { nombre: "Conductividad", unidad: "mS/cm", instrumentado: false },
  { nombre: "Sólidos disueltos totales", unidad: "mg/l", instrumentado: false },
  { nombre: "Oxígeno disuelto", unidad: "mg/l", instrumentado: false },
  { nombre: "Nivel de agua", unidad: "cm (diferencial)", instrumentado: false },
];

export default function CalidadAguaPage() {
  const conDatos = humedalesAltoAtoyac.filter((h) => h.agua !== null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Calidad del agua</h1>
        <p className="text-sm text-muted">
          Ningún parámetro se muestra como medido en tiempo real a menos que exista instrumentación real conectada.
        </p>
      </div>

      <Panel titulo="Parámetros contemplados" icono={FlaskConical} etiqueta="simulado">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PARAMETROS.map((p) => (
            <div key={p.nombre} className="rounded-lg border border-line bg-bg p-3">
              <p className="text-sm font-medium text-ink">{p.nombre}</p>
              <p className="text-xs text-muted">{p.unidad}</p>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">Sin instrumentación todavía</p>
            </div>
          ))}
        </div>
      </Panel>

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
