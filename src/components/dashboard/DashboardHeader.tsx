"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, Wifi, WifiOff, User, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FullscreenToggle } from "@/components/FullscreenToggle";
import { TODOS_LOS_ITEMS } from "./nav-items";

function useEstadoConexion() {
  // Default "en línea" en el primer render (igual en servidor y cliente) para
  // no causar un hydration mismatch; navigator.onLine solo existe en el
  // navegador, así que el valor real se lee después de montar.
  const [enLinea, setEnLinea] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- navigator.onLine no existe en el servidor; debe leerse tras montar para no romper la hidratación
    setEnLinea(navigator.onLine);
    const on = () => setEnLinea(true);
    const off = () => setEnLinea(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return enLinea;
}

function Breadcrumbs() {
  const pathname = usePathname();
  const actual = TODOS_LOS_ITEMS.find(
    (i) => pathname === i.href || (!i.exacto && pathname.startsWith(i.href + "/"))
  );
  const titulo = actual?.label ?? "Centro de operaciones";
  return (
    <div className="hidden items-center gap-1.5 text-sm text-muted sm:flex">
      <span>Atoyac</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="font-medium text-ink">{titulo}</span>
    </div>
  );
}

function Buscador() {
  const router = useRouter();
  const [consulta, setConsulta] = useState("");
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resultados =
    consulta.trim().length > 0
      ? TODOS_LOS_ITEMS.filter((i) => i.label.toLowerCase().includes(consulta.toLowerCase()))
      : [];

  useEffect(() => {
    const alHacerClicFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", alHacerClicFuera);

    // Atajo tipo Spotlight: Ctrl+K / Cmd+K enfoca el buscador que ya existe
    // en el header (no es un modal nuevo, es el mismo buscador real).
    const alPresionarTecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setAbierto(true);
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setAbierto(false);
      }
    };
    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.removeEventListener("mousedown", alHacerClicFuera);
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, []);

  return (
    <div ref={contenedorRef} className="relative hidden w-60 md:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        value={consulta}
        onChange={(e) => {
          setConsulta(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        placeholder="Buscar… (Ctrl+K)"
        className="w-full rounded-xl border border-line bg-bg py-1.5 pl-8 pr-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {abierto && resultados.length > 0 && (
        <div className="glass absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl">
          {resultados.map((r) => (
            <button
              key={r.href}
              onClick={() => {
                router.push(r.href);
                setConsulta("");
                setAbierto(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-accent/5"
            >
              <r.icon className="h-3.5 w-3.5 text-muted" />
              {r.label}
            </button>
          ))}
        </div>
      )}
      {abierto && consulta.trim().length > 0 && resultados.length === 0 && (
        <div className="glass absolute left-0 right-0 top-full z-20 mt-1 rounded-xl px-3 py-2 text-sm text-muted">
          Sin resultados
        </div>
      )}
    </div>
  );
}

export function DashboardHeader({ onAbrirMenuMovil }: { onAbrirMenuMovil: () => void }) {
  const enLinea = useEstadoConexion();
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);

  return (
    <header className="glass flex h-16 items-center gap-3 rounded-b-2xl px-4 sm:px-6">
      <button
        onClick={onAbrirMenuMovil}
        className="rounded-xl p-2 text-muted hover:bg-accent/5 hover:text-ink lg:hidden"
        aria-label="Abrir menú de navegación"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <Buscador />

        <div
          className={
            "hidden items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ring-1 sm:flex " +
            (enLinea
              ? "bg-accent2/10 text-accent2 ring-accent2/20"
              : "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300")
          }
        >
          {enLinea ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {enLinea ? "Conectado" : "Sin conexión"}
        </div>

        <FullscreenToggle />
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setNotificacionesAbiertas((v) => !v)}
            className="rounded-xl border border-line bg-surface p-2 text-muted hover:bg-accent/5 hover:text-ink"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
          </button>
          {notificacionesAbiertas && (
            <div className="glass absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl p-3 text-sm">
              <p className="font-medium text-ink">Notificaciones</p>
              <p className="mt-1 text-xs text-muted">
                Sin notificaciones — entorno de demostración, aún no hay eventos reales conectados.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuUsuarioAbierto((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent hover:bg-accent/25"
            aria-label="Menú de usuario"
          >
            <User className="h-4 w-4" />
          </button>
          {menuUsuarioAbierto && (
            <div className="glass absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl p-1 text-sm">
              <div className="px-3 py-2">
                <p className="font-medium text-ink">Invitado</p>
                <p className="text-xs text-muted">Modo demostración · sin rol asignado</p>
              </div>
              <div className="my-1 border-t border-line" />
              <Link
                href="/dashboard/configuracion"
                className="block rounded-lg px-3 py-1.5 text-ink hover:bg-accent/5"
                onClick={() => setMenuUsuarioAbierto(false)}
              >
                Preferencias
              </Link>
              <Link
                href="/login"
                className="block rounded-lg px-3 py-1.5 text-ink hover:bg-accent/5"
                onClick={() => setMenuUsuarioAbierto(false)}
              >
                Iniciar sesión real
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
