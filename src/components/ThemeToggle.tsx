"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

const OPCIONES = [
  { valor: "light", icono: Sun, etiqueta: "Claro" },
  { valor: "dark", icono: Moon, etiqueta: "Oscuro" },
  { valor: "system", icono: Monitor, etiqueta: "Automático" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón estándar de next-themes para evitar desajuste de hidratación
    setMontado(true);
  }, []);
  if (!montado) return <div className="h-9 w-28" />;

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-line bg-surface p-0.5">
      {OPCIONES.map(({ valor, icono: Icono, etiqueta }) => (
        <button
          key={valor}
          onClick={() => setTheme(valor)}
          title={etiqueta}
          aria-pressed={theme === valor}
          className={
            "rounded px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
            (theme === valor
              ? "bg-accent/15 text-accent"
              : "text-muted hover:bg-accent/5 hover:text-ink")
          }
        >
          <Icono className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
