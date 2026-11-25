import { MapPinned } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import MapaHumedales from "@/components/MapaHumedales3DClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = { title: "Mapa interactivo — Atoyac" };

export default function MapaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Mapa interactivo</h1>
        <p className="text-sm text-muted">
          Ubicaciones reales de los 10 humedales identificados por INEGI en la cuenca del Alto Atoyac.
        </p>
      </div>
      <Panel titulo="Capas disponibles: Humedales" icono={MapPinned} etiqueta="real">
        <p className="mb-3 text-sm text-muted">
          Capas pendientes (requieren hardware o acuerdos de datos reales): ríos
          detallados, trampas de residuos, dispositivos ESP32, cámaras, zonas de
          riesgo e incidentes. Se agregan cuando exista la fuente de datos
          correspondiente, sin inventar su contenido.
        </p>
        <div className="h-[560px] overflow-hidden rounded-lg border border-line">
          <ErrorBoundary fallbackTitulo="El mapa no pudo cargar en este equipo.">
            <MapaHumedales />
          </ErrorBoundary>
        </div>
      </Panel>
    </div>
  );
}
