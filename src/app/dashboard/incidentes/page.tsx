import { AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";

export const metadata = { title: "Incidentes — Atoyac" };

const ETAPAS = ["Detectado", "Pendiente de revisión", "Asignado", "En atención", "Resuelto"];

export default function IncidentesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Incidentes</h1>
        <p className="text-sm text-muted">0 incidentes registrados.</p>
      </div>
      <Panel titulo="Flujo de atención" icono={AlertTriangle} etiqueta="propuesto">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {ETAPAS.map((etapa, i) => (
            <span key={etapa} className="flex items-center gap-2">
              <span className="rounded-full border border-line px-3 py-1 text-ink">{etapa}</span>
              {i < ETAPAS.length - 1 && <span className="text-muted">→</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          Este flujo todavía no mueve registros reales: falta la tabla de
          incidentes en Supabase y un responsable asignable por rol.
        </p>
      </Panel>
    </div>
  );
}
