"use client";

import { useEffect, useRef } from "react";
import {
  Map as MaplibreMap,
  Marker,
  Popup,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { ETIQUETA_ESTADO, type EstadoReporte } from "@/lib/reportes";

if (typeof window !== "undefined") {
  setWorkerUrl(
    new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href
  );
}

const CENTRO_CUENCA: [number, number] = [-98.2, 19.2];

const COLOR_POR_ESTADO: Record<EstadoReporte, string> = {
  borrador: "#71717a",
  recibido: "#f59e0b",
  asignado: "#0ea5e9",
  atendido: "#10b981",
};

export type ReporteConUbicacion = {
  id: string;
  folio: string;
  tipo: string;
  ubicacion_texto: string;
  estado: EstadoReporte;
  fuente: string;
  lat: number;
  lng: number;
};

export default function MapaReportesPublico({
  reportes,
}: {
  reportes: ReporteConUbicacion[];
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MaplibreMap | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) return;

    const map = new MaplibreMap({
      container: contenedorRef.current,
      style:
        resolvedTheme === "light"
          ? "https://tiles.openfreemap.org/styles/positron"
          : "https://tiles.openfreemap.org/styles/dark",
      center: CENTRO_CUENCA,
      zoom: 9,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl(), "top-left");
    mapaRef.current = map;

    return () => {
      map.remove();
      mapaRef.current = null;
    };
    // Solo se crea una vez; el tema se sincroniza en el efecto de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambiar de estilo claro/oscuro cuando cambia el tema de la app.
  useEffect(() => {
    const map = mapaRef.current;
    if (!map || !resolvedTheme) return;
    map.setStyle(
      resolvedTheme === "light"
        ? "https://tiles.openfreemap.org/styles/positron"
        : "https://tiles.openfreemap.org/styles/dark"
    );
  }, [resolvedTheme]);

  // Marcadores: se vuelven a dibujar cada vez que cambia la lista de reportes
  // (incluye las actualizaciones en vivo por Supabase Realtime).
  useEffect(() => {
    const map = mapaRef.current;
    if (!map) return;

    marcadoresRef.current.forEach((m) => m.remove());
    marcadoresRef.current = reportes.map((r) => {
      const color = COLOR_POR_ESTADO[r.estado];
      const el = document.createElement("div");
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "9999px";
      el.style.border = `2px solid ${color}`;
      el.style.background = `${color}55`;
      el.style.cursor = "pointer";

      const popupHtml = `
        <div style="min-width:180px;font-size:13px;line-height:1.4">
          <p style="font-weight:600;margin:0 0 2px">${r.tipo}</p>
          <p style="margin:0">${r.ubicacion_texto}</p>
          <p style="margin:4px 0 0;font-size:11px;opacity:.8">
            ${ETIQUETA_ESTADO[r.estado]} · ${r.fuente === "whatsapp" ? "WhatsApp" : "Web"}
          </p>
          <p style="margin:2px 0 0;font-size:11px;opacity:.6">${r.folio}</p>
        </div>`;

      return new Marker({ element: el })
        .setLngLat([r.lng, r.lat])
        .setPopup(new Popup({ offset: 12 }).setHTML(popupHtml))
        .addTo(map);
    });
  }, [reportes]);

  return <div ref={contenedorRef} className="h-full w-full" />;
}
