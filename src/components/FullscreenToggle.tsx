"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";

export function FullscreenToggle() {
  const [completo, setCompleto] = useState(false);

  useEffect(() => {
    const alActualizar = () => setCompleto(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", alActualizar);
    return () => document.removeEventListener("fullscreenchange", alActualizar);
  }, []);

  const alternar = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <button
      onClick={alternar}
      title={completo ? "Salir de pantalla completa" : "Pantalla completa"}
      className="rounded-md border border-line bg-surface p-2 text-muted transition-colors hover:bg-accent/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {completo ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
    </button>
  );
}
