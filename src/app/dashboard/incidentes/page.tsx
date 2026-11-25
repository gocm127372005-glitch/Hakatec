import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { FiltrosIncidentes } from "./FiltrosIncidentes";
import { ListaIncidentes } from "./ListaIncidentes";

export const metadata = { title: "Incidentes — Atoyac" };

export default function IncidentesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string; institucion?: string }>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Incidentes</h1>
        <p className="text-sm text-muted">
          Reportes ciudadanos (formulario web y WhatsApp), filtrables por
          institución destino en vez de un login separado por dependencia.
        </p>
      </div>
      <Panel titulo="Reportes recibidos" icono={AlertTriangle} etiqueta="real" fuenteEtiqueta="Supabase">
        <Suspense fallback={<FiltrosIncidentes />}>
          <FiltrosConValores searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<p className="py-6 text-sm text-muted">Cargando reportes…</p>}>
          <ListaIncidentes searchParams={searchParams} />
        </Suspense>
      </Panel>
    </div>
  );
}

async function FiltrosConValores({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string; institucion?: string }>;
}) {
  const { estado, tipo, institucion } = await searchParams;
  return <FiltrosIncidentes estado={estado} tipo={tipo} institucion={institucion} />;
}
