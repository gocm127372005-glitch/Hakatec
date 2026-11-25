import { Cpu } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";
import { Panel } from "@/components/dashboard/Panel";
import { crearClienteSupabaseServidor, isSupabaseConfigured } from "@/lib/supabase/server";
import { COLUMNAS_LECTURA_SENSOR, dispositivoEnLinea, type LecturaSensor } from "@/lib/sensores";

export const metadata = { title: "Dispositivos IoT — Atoyac" };

export default async function DispositivosPage() {
  const dispositivos = await obtenerUltimaLecturaPorDispositivo();

  if (dispositivos.length === 0) {
    return (
      <PaginaPendiente
        icono={Cpu}
        titulo="Dispositivos ESP32 / LoRa"
        descripcion="0 dispositivos conectados. Ningún ESP32 está reportando datos a este sistema todavía — no se muestran dispositivos ficticios como conectados."
        faltaPara={[
          "Construir la trampa con los 2 sensores ultrasónicos (diferencial de nivel)",
          "Definir el esquema de la tabla 'dispositivos' en Supabase (id, nombre, ubicación, última comunicación)",
          "Código del ESP32 enviando telemetría por HTTP REST a ese esquema",
          "Credenciales reales de Supabase configuradas en Vercel",
        ]}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Dispositivos IoT</h1>
        <p className="text-sm text-muted">
          Trampas ESP32 que han enviado telemetría a la tabla{" "}
          <code>lecturas_sensores</code> en Supabase.
        </p>
      </div>
      <Panel
        titulo={`${dispositivos.length} dispositivo(s)`}
        icono={Cpu}
        etiqueta="real"
        fuenteEtiqueta="ESP32"
      >
        <div className="divide-y divide-line">
          {dispositivos.map((d) => {
            const enLinea = dispositivoEnLinea(d.creado_en);
            return (
              <div key={d.dispositivo_id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-mono text-sm text-ink">{d.dispositivo_id}</p>
                  <p className="text-xs text-muted">
                    Última lectura: {new Date(d.creado_en).toLocaleString("es-MX")} · Estado: {d.estado ?? "—"}
                  </p>
                </div>
                <span
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 " +
                    (enLinea
                      ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
                      : "bg-zinc-500/10 text-zinc-600 ring-zinc-500/20 dark:text-zinc-300")
                  }
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${enLinea ? "bg-emerald-500" : "bg-zinc-500"}`} />
                  {enLinea ? "En línea" : "Sin respuesta"}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

async function obtenerUltimaLecturaPorDispositivo(): Promise<LecturaSensor[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await crearClienteSupabaseServidor();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lecturas_sensores")
    .select(COLUMNAS_LECTURA_SENSOR)
    .order("creado_en", { ascending: false })
    .limit(200);

  if (error || !data) return [];

  const porDispositivo = new Map<string, LecturaSensor>();
  for (const lectura of data as unknown as LecturaSensor[]) {
    if (!porDispositivo.has(lectura.dispositivo_id)) {
      porDispositivo.set(lectura.dispositivo_id, lectura);
    }
  }
  return Array.from(porDispositivo.values());
}
