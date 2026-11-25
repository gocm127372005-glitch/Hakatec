import { TIPOS_REPORTE, ESTADOS_REPORTE, ETIQUETA_ESTADO } from "@/lib/reportes";

export function FiltrosIncidentes({
  estado,
  tipo,
  institucion,
}: {
  estado?: string;
  tipo?: string;
  institucion?: string;
}) {
  return (
    <form className="mb-3 flex flex-wrap items-end gap-2" action="/dashboard/incidentes">
      <div>
        <label className="mb-1 block text-xs text-muted">Estado</label>
        <select
          name="estado"
          defaultValue={estado ?? ""}
          className="rounded-md border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
        >
          <option value="">Todos</option>
          {ESTADOS_REPORTE.map((e) => (
            <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Tipo de problema</label>
        <select
          name="tipo"
          defaultValue={tipo ?? ""}
          className="rounded-md border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
        >
          <option value="">Todos</option>
          {TIPOS_REPORTE.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Institución destino</label>
        <input
          type="text"
          name="institucion"
          defaultValue={institucion ?? ""}
          placeholder="Ej. CONAGUA, municipio…"
          className="rounded-md border border-line bg-bg px-2.5 py-1.5 text-sm text-ink placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
      >
        Filtrar
      </button>
      {(estado || tipo || institucion) && (
        <a href="/dashboard/incidentes" className="text-xs text-muted underline">
          Quitar filtros
        </a>
      )}
    </form>
  );
}
