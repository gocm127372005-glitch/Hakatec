import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Etiqueta } from "./Etiqueta";

export function Panel({
  titulo,
  icono: Icono,
  etiqueta,
  acciones,
  children,
}: {
  titulo: string;
  icono: LucideIcon;
  etiqueta: "real" | "simulado" | "propuesto";
  acciones?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-medium text-ink">
          <Icono className="h-4 w-4 text-accent" />
          {titulo}
        </h2>
        <div className="flex items-center gap-2">
          {acciones}
          <Etiqueta tipo={etiqueta} />
        </div>
      </div>
      {children}
    </div>
  );
}
