import { Cpu } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";

export const metadata = { title: "Dispositivos IoT — Atoyac" };

export default function DispositivosPage() {
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
