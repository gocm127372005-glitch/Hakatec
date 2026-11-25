"use server";

import { revalidatePath } from "next/cache";
import { crearClienteSupabaseServidor } from "@/lib/supabase/server";
import { ESTADOS_REPORTE, type EstadoReporte } from "@/lib/reportes";

export async function actualizarIncidente(formData: FormData) {
  const id = formData.get("id");
  const estado = formData.get("estado");
  const institucionEscalada = formData.get("institucion_escalada");
  const kgRetirados = formData.get("kg_retirados");

  if (typeof id !== "string" || !id) return;
  if (typeof estado !== "string" || !ESTADOS_REPORTE.includes(estado as EstadoReporte)) return;

  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return;

  const actualizacion: Record<string, unknown> = { estado };

  if (typeof institucionEscalada === "string" && institucionEscalada.trim()) {
    actualizacion.institucion_escalada = institucionEscalada.trim();
  }

  if (typeof kgRetirados === "string" && kgRetirados.trim()) {
    const kg = Number(kgRetirados);
    if (!Number.isNaN(kg)) actualizacion.kg_retirados = kg;
  }

  if (estado === "atendido") {
    actualizacion.atendido_en = new Date().toISOString();
  }

  await supabase.from("reportes").update(actualizacion).eq("id", id);

  revalidatePath("/dashboard/incidentes");
}
