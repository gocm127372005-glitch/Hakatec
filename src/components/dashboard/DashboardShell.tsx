"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardShell({ children, banner }: { children: ReactNode; banner?: ReactNode }) {
  // Default sin colapsar en el primer render (igual en servidor y cliente);
  // la preferencia guardada en localStorage solo se puede leer tras montar.
  const [colapsado, setColapsado] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("sidebar-colapsado") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage no existe en el servidor; debe leerse tras montar para no romper la hidratación
      setColapsado(true);
    }
  }, []);

  const alternarColapsado = () => {
    setColapsado((v) => {
      localStorage.setItem("sidebar-colapsado", !v ? "1" : "0");
      return !v;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-ink dark:bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(14,165,233,0.06),transparent)]">
      <div className="hidden lg:block">
        <SidebarNav colapsado={colapsado} onToggleColapsado={alternarColapsado} />
      </div>

      {menuMovilAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuMovilAbierto(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <SidebarNav colapsado={false} onNavegar={() => setMenuMovilAbierto(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onAbrirMenuMovil={() => setMenuMovilAbierto(true)} />
        {banner}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
