"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Waves } from "lucide-react";
import { NAV_GROUPS } from "./nav-items";

function esActivo(pathname: string, href: string, exacto?: boolean) {
  if (exacto) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({
  colapsado,
  onToggleColapsado,
  className = "",
  onNavegar,
}: {
  colapsado: boolean;
  onToggleColapsado?: () => void;
  className?: string;
  onNavegar?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={
        "glass flex h-full flex-col rounded-r-2xl transition-[width] duration-200 " +
        (colapsado ? "w-16" : "w-62") +
        " " +
        className
      }
    >
      <div className="flex items-center gap-2 px-3 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2">
          <Waves className="h-4.5 w-4.5 text-zinc-950" />
        </div>
        {!colapsado && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-ink">Atoyac</p>
            <p className="truncate text-[11px] leading-tight text-muted">Centro de monitoreo</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-4">
        {NAV_GROUPS.map((grupo) => (
          <div key={grupo.titulo}>
            {!colapsado && (
              <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted/70">
                {grupo.titulo}
              </p>
            )}
            <div className="space-y-0.5">
              {grupo.items.map(({ href, label, icon: Icon, exacto }) => {
                const activo = esActivo(pathname, href, exacto);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavegar}
                    title={colapsado ? label : undefined}
                    aria-current={activo ? "page" : undefined}
                    className={
                      "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
                      (activo
                        ? "bg-accent/15 font-medium text-accent"
                        : "text-muted hover:bg-accent/5 hover:text-ink") +
                      (colapsado ? " justify-center" : "")
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!colapsado && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2">
        {onToggleColapsado && (
          <button
            onClick={onToggleColapsado}
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-2.5 py-2 text-sm text-muted transition-colors hover:bg-accent/5 hover:text-ink lg:flex"
            title={colapsado ? "Expandir menú" : "Contraer menú"}
          >
            {colapsado ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!colapsado && "Contraer"}
          </button>
        )}
        <div
          className={
            "mt-2 flex items-center gap-2 rounded-xl bg-accent/5 px-2.5 py-2 " +
            (colapsado ? "justify-center" : "")
          }
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
            DM
          </div>
          {!colapsado && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">Invitado</p>
              <p className="truncate text-[11px] text-muted">Modo demostración</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
