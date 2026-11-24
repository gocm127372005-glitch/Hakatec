import { History } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";

export const metadata = { title: "Auditoría — Atoyac" };

export default function AuditoriaPage() {
  return (
    <PaginaPendiente
      icono={History}
      titulo="Historial y auditoría"
      descripcion="Sin eventos que auditar todavía — no hay usuarios reales ni escrituras en la base de datos."
      faltaPara={[
        "Autenticación real (para saber quién hizo qué)",
        "Tabla 'auditoria' en Supabase con trigger o registro explícito por cada escritura",
        "Decidir qué acciones son auditables (cambios de rol, cierre de incidentes, exportación de informes)",
      ]}
    />
  );
}
