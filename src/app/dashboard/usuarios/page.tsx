import { Users } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";

export const metadata = { title: "Usuarios — Atoyac" };

export default function UsuariosPage() {
  return (
    <PaginaPendiente
      icono={Users}
      titulo="Usuarios y permisos"
      descripcion="Requiere autenticación real configurada. Nadie puede asignarse privilegios de administrador desde un registro público."
      faltaPara={[
        "Crear el proyecto de Supabase y habilitar Supabase Auth (ver /dashboard/configuracion)",
        "Agregar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel",
        "Tabla 'perfiles' con columna de rol, poblada manualmente por un administrador — nunca autoasignable",
        "Row Level Security en Supabase para que cada rol solo lea/escriba lo que le corresponde",
      ]}
    />
  );
}
