import { Waves } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { Etiqueta } from "@/components/dashboard/Etiqueta";
import { ExportarHumedalesCSV } from "@/components/dashboard/ExportarHumedalesCSV";
import { humedalesAltoAtoyac } from "@/data/humedales";

export const metadata = { title: "Humedales — Atoyac" };

export default function HumedalesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Humedales</h1>
        <p className="text-sm text-muted">
          Los 10 humedales naturales/artificiales ya existentes y documentados
          por INEGI (2019) en la cuenca del Alto Atoyac. Ningún humedal
          artificial propuesto por el equipo está construido todavía — se
          mostrará aquí marcado como <em>propuesto</em> cuando exista un diseño real.
        </p>
      </div>

      <Panel
        titulo={`Inventario (${humedalesAltoAtoyac.length})`}
        icono={Waves}
        etiqueta="real"
        acciones={<ExportarHumedalesCSV />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {humedalesAltoAtoyac.map((h) => (
            <div key={h.id} className="rounded-lg border border-line bg-bg p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-ink">{h.nombre}</p>
                {h.sitioRamsar && (
                  <span className="shrink-0 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-300">
                    RAMSAR
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">{h.municipios}, {h.estado}</p>
              <dl className="mt-2 space-y-0.5 text-xs text-ink">
                <div className="flex justify-between"><dt className="text-muted">Tipo</dt><dd>{h.sistema}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Área</dt><dd>{h.areaKm2} km²</dd></div>
                {h.lirioAcuaticoPorcentaje !== null && (
                  <div className="flex justify-between"><dt className="text-muted">Lirio acuático</dt><dd>{h.lirioAcuaticoPorcentaje}%</dd></div>
                )}
              </dl>
              <p className="mt-2 text-[11px] text-muted">{h.fuente}</p>
              {h.agua ? (
                <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">Tiene medición in situ real</p>
              ) : (
                <p className="mt-1 text-[11px] text-muted">Sin medición fisicoquímica reportada</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted">
          <Etiqueta tipo="real" /> Ubicaciones aproximadas, leídas de los mapas georreferenciados del propio informe INEGI 2019.
        </p>
      </Panel>
    </div>
  );
}
