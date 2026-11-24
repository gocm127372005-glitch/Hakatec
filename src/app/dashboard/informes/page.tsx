import { FileText } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { ExportarHumedalesCSV } from "@/components/dashboard/ExportarHumedalesCSV";

export const metadata = { title: "Informes — Atoyac" };

const INFORMES = [
  { nombre: "Inventario de humedales", disponible: true, formato: "CSV" },
  { nombre: "Calidad del agua por estación", disponible: false, formato: "PDF/CSV" },
  { nombre: "Incidentes por fecha", disponible: false, formato: "PDF/CSV" },
  { nombre: "Estado de dispositivos", disponible: false, formato: "CSV" },
];

export default function InformesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Informes</h1>
        <p className="text-sm text-muted">
          Solo se puede exportar lo que ya existe como dato real. Un archivo
          descargado nunca debe prometer más de lo que el sistema realmente mide.
        </p>
      </div>
      <Panel titulo="Informes disponibles" icono={FileText} etiqueta="real">
        <ul className="divide-y divide-line">
          {INFORMES.map((i) => (
            <li key={i.nombre} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm text-ink">{i.nombre}</p>
                <p className="text-xs text-muted">{i.formato}</p>
              </div>
              {i.disponible ? (
                <ExportarHumedalesCSV />
              ) : (
                <span className="text-xs text-amber-700 dark:text-amber-300">Pendiente de datos</span>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
