import { Bell } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";

export const metadata = { title: "Alertas — Atoyac" };

const NIVELES = [
  { nombre: "Normal", color: "bg-emerald-500" },
  { nombre: "Advertencia", color: "bg-amber-500" },
  { nombre: "Alto", color: "bg-orange-500" },
  { nombre: "Crítico", color: "bg-red-500" },
];

export default function AlertasPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Alertas</h1>
        <p className="text-sm text-muted">
          Una alerta es automática (la genera un sensor); un incidente es gestionado por una persona. Se mantienen separados.
        </p>
      </div>
      <Panel titulo="Semáforo propio de alerta" icono={Bell} etiqueta="simulado">
        <p className="mb-3 text-sm text-muted">
          Niveles que usará la trampa (inspirados en la lógica de CONAGUA, no son el semáforo oficial):
        </p>
        <div className="flex flex-wrap gap-2">
          {NIVELES.map((n) => (
            <span key={n.nombre} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-ink">
              <span className={`h-2 w-2 rounded-full ${n.color}`} />
              {n.nombre}
            </span>
          ))}
        </div>
      </Panel>
      <Panel titulo="Historial de alertas" icono={Bell} etiqueta="simulado">
        <p className="text-sm text-muted">
          Sin alertas generadas todavía. Cada alerta real quedará trazable
          hasta la medición exacta que la originó (sensor, hora, valor).
        </p>
      </Panel>
    </div>
  );
}
