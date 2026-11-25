import { crearClienteSupabaseServidor, isSupabaseConfigured } from "@/lib/supabase/server";
import { ESTADOS_REPORTE, ETIQUETA_ESTADO, COLOR_ESTADO, type EstadoReporte } from "@/lib/reportes";
import { actualizarIncidente } from "./actions";

type Reporte = {
  id: string;
  folio: string;
  tipo: string;
  descripcion: string;
  ubicacion_texto: string;
  fuente: string;
  estado: EstadoReporte;
  institucion_escalada: string | null;
  kg_retirados: number | null;
  creado_en: string;
};

export async function ListaIncidentes({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string; institucion?: string }>;
}) {
  const { estado, tipo, institucion } = await searchParams;

  if (!isSupabaseConfigured) {
    return (
      <p className="py-6 text-sm text-muted">
        Este despliegue no tiene Supabase configurado — no hay reportes que mostrar.
      </p>
    );
  }

  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return null;

  let consulta = supabase
    .from("reportes")
    .select("id, folio, tipo, descripcion, ubicacion_texto, fuente, estado, institucion_escalada, kg_retirados, creado_en")
    .neq("estado", "borrador")
    .order("creado_en", { ascending: false })
    .limit(200);

  if (estado) consulta = consulta.eq("estado", estado);
  if (tipo) consulta = consulta.eq("tipo", tipo);
  if (institucion) consulta = consulta.ilike("institucion_escalada", `%${institucion}%`);

  const { data, error } = await consulta;

  if (error) {
    return (
      <p className="py-6 text-sm text-red-700 dark:text-red-300">
        No se pudieron cargar los reportes: {error.message}
      </p>
    );
  }

  const reportes = (data ?? []) as Reporte[];

  if (reportes.length === 0) {
    return (
      <p className="py-6 text-sm text-muted">
        0 incidentes con estos filtros. Los reportes aparecen aquí en cuanto alguien
        los envía por el formulario web o por WhatsApp.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">{reportes.length} reporte(s).</p>
      <div className="divide-y divide-line">
        {reportes.map((r) => (
          <div key={r.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">{r.folio}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${COLOR_ESTADO[r.estado]}`}
                >
                  {ETIQUETA_ESTADO[r.estado]}
                </span>
                <span className="text-xs text-muted">{r.fuente}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink">{r.tipo}</p>
              <p className="text-sm text-muted">{r.descripcion}</p>
              <p className="text-xs text-muted">
                📍 {r.ubicacion_texto} · {new Date(r.creado_en).toLocaleString("es-MX")}
              </p>
              {r.institucion_escalada && (
                <p className="text-xs text-muted">Escalado a: {r.institucion_escalada}</p>
              )}
              {r.kg_retirados != null && (
                <p className="text-xs text-muted">{r.kg_retirados} kg retirados</p>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <div className="flex flex-wrap justify-end gap-1.5">
                {r.estado !== "asignado" && r.estado !== "atendido" && (
                  <form action={actualizarIncidente}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="estado" value="asignado" />
                    <button
                      type="submit"
                      className="rounded-md bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-500/20 hover:bg-sky-500/20 dark:text-sky-300"
                    >
                      Marcar en revisión
                    </button>
                  </form>
                )}
                {r.estado !== "atendido" && (
                  <form action={actualizarIncidente}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="estado" value="atendido" />
                    <button
                      type="submit"
                      className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-300"
                    >
                      Marcar como solucionado
                    </button>
                  </form>
                )}
              </div>
              {r.fuente === "whatsapp" && (r.estado === "asignado" || r.estado === "atendido") && (
                <p className="text-right text-[10px] text-muted">
                  Se avisará por WhatsApp (puede tardar hasta ~1 hora).
                </p>
              )}

              <form action={actualizarIncidente} className="flex flex-wrap items-end gap-1.5">
                <input type="hidden" name="id" value={r.id} />
                <select
                  name="estado"
                  defaultValue={r.estado}
                  className="rounded-md border border-line bg-bg px-2 py-1 text-xs text-ink"
                >
                  {ESTADOS_REPORTE.filter((e) => e !== "borrador").map((e) => (
                    <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="institucion_escalada"
                  defaultValue={r.institucion_escalada ?? ""}
                  placeholder="Institución"
                  className="w-28 rounded-md border border-line bg-bg px-2 py-1 text-xs text-ink placeholder:text-muted"
                />
                <input
                  type="number"
                  name="kg_retirados"
                  step="0.1"
                  defaultValue={r.kg_retirados ?? ""}
                  placeholder="kg"
                  className="w-16 rounded-md border border-line bg-bg px-2 py-1 text-xs text-ink placeholder:text-muted"
                />
                <button
                  type="submit"
                  className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
                >
                  Guardar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
