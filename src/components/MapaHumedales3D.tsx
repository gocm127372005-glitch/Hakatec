"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as MaplibreMap,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  setWorkerUrl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Turbopack no resuelve bien la URL por defecto del worker de MapLibre
// (import.meta.url dentro del paquete empaquetado); se fija explícitamente
// para que la sirva como asset estático real.
if (typeof window !== "undefined") {
  setWorkerUrl(
    new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href
  );
}
import { useTheme } from "next-themes";
import { Layers, Mountain } from "lucide-react";
import { humedalesAltoAtoyac } from "@/data/humedales";

const CENTRO_CUENCA: [number, number] = [-98.2, 19.2];

// Fuente de terreno: AWS Open Data "Terrain Tiles" (proyecto Mapzen / Linux
// Foundation), formato terrarium, gratuita y sin API key. Atribución según
// la documentación del proyecto Joerd.
const TERRENO_URL =
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

type EstiloId = "claro" | "oscuro" | "satelite" | "topografico";

function construirEstilo(id: EstiloId): string | StyleSpecification {
  if (id === "claro") return "https://tiles.openfreemap.org/styles/positron";
  if (id === "oscuro") return "https://tiles.openfreemap.org/styles/dark";

  if (id === "satelite") {
    return {
      version: 8,
      sources: {
        esri: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "Esri, Maxar, Earthstar Geographics",
        },
      },
      layers: [{ id: "esri", type: "raster", source: "esri" }],
    };
  }

  // topográfico
  return {
    version: 8,
    sources: {
      esri: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri, HERE, Garmin, FAO, NOAA, USGS",
      },
    },
    layers: [{ id: "esri", type: "raster", source: "esri" }],
  };
}

function agregarTerreno(map: MaplibreMap, exageracion: number) {
  if (!map.getSource("terreno")) {
    map.addSource("terreno", {
      type: "raster-dem",
      tiles: [TERRENO_URL],
      tileSize: 256,
      encoding: "terrarium",
      maxzoom: 15,
      attribution:
        'Terreno: <a href="https://github.com/tilezen/joerd" target="_blank" rel="noreferrer">AWS Terrain Tiles (Mapzen)</a>',
    });
  }
  map.setTerrain({ source: "terreno", exaggeration: exageracion });
}

export default function MapaHumedales3D() {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MaplibreMap | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);
  const { resolvedTheme } = useTheme();

  const [estilo, setEstilo] = useState<EstiloId>("oscuro");
  const [relieve3D, setRelieve3D] = useState(true);
  const [exageracion, setExageracion] = useState(1.5);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [listo, setListo] = useState(false);

  // Estilo inicial según el tema de la app (se puede cambiar manualmente luego).
  useEffect(() => {
    if (!listo && resolvedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza el estilo inicial con el tema de la app, que solo se conoce tras montar
      setEstilo(resolvedTheme === "light" ? "claro" : "oscuro");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);

  useEffect(() => {
    if (!contenedorRef.current || mapaRef.current) return;

    const map = new MaplibreMap({
      container: contenedorRef.current,
      style: construirEstilo(estilo),
      center: CENTRO_CUENCA,
      zoom: 9,
      pitch: relieve3D ? 55 : 0,
      maxPitch: 75,
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), "top-left");
    map.addControl(new FullscreenControl(), "top-left");

    map.on("load", () => {
      if (relieve3D) agregarTerreno(map, exageracion);
      setListo(true);
    });

    mapaRef.current = map;
    return () => {
      map.remove();
      mapaRef.current = null;
    };
    // Solo se crea una vez; el cambio de estilo/terreno se maneja en los efectos de abajo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambiar de estilo base (claro/oscuro/satélite/topográfico).
  useEffect(() => {
    const map = mapaRef.current;
    if (!map || !listo) return;
    map.setStyle(construirEstilo(estilo));
    map.once("style.load", () => {
      if (relieve3D) agregarTerreno(map, exageracion);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estilo]);

  // Alternar relieve 3D / vista plana 2D.
  useEffect(() => {
    const map = mapaRef.current;
    if (!map || !listo) return;
    if (relieve3D) {
      agregarTerreno(map, exageracion);
      map.easeTo({ pitch: 55, duration: 800 });
    } else {
      map.setTerrain(null);
      map.easeTo({ pitch: 0, duration: 800 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relieve3D, listo]);

  // Ajustar exageración vertical sin reconstruir la fuente.
  useEffect(() => {
    const map = mapaRef.current;
    if (!map || !listo || !relieve3D) return;
    if (map.getSource("terreno")) {
      map.setTerrain({ source: "terreno", exaggeration: exageracion });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exageracion]);

  // Marcadores reales de humedales (persisten entre cambios de estilo).
  useEffect(() => {
    const map = mapaRef.current;
    if (!map || !listo) return;

    marcadoresRef.current.forEach((m) => m.remove());
    marcadoresRef.current = humedalesAltoAtoyac.map((h) => {
      const el = document.createElement("div");
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "9999px";
      el.style.border = "2px solid " + (h.sitioRamsar ? "#38bdf8" : "#5eead4");
      el.style.background = (h.sitioRamsar ? "#38bdf8" : "#5eead4") + "55";
      el.style.cursor = "pointer";

      const popupHtml = `
        <div style="min-width:180px;font-size:13px;line-height:1.4">
          <p style="font-weight:600;margin:0 0 2px">${h.nombre}</p>
          <p style="margin:0">${h.municipios}, ${h.estado}</p>
          <p style="margin:0">Área: ${h.areaKm2} km²</p>
          ${h.sitioRamsar ? '<p style="margin:0;color:#0284c7">Sitio RAMSAR</p>' : ""}
          ${
            h.agua
              ? `<div style="margin-top:4px;border-top:1px solid rgba(128,128,128,.3);padding-top:4px">
                  <p style="margin:0">pH: ${h.agua.pH}</p>
                  <p style="margin:0">Conductividad: ${h.agua.conductividad_mS_cm} mS/cm</p>
                </div>`
              : ""
          }
          <p style="margin:4px 0 0;font-size:11px;opacity:.7">Fuente: ${h.fuente}</p>
        </div>`;

      return new Marker({ element: el })
        .setLngLat([h.lng, h.lat])
        .setPopup(new Popup({ offset: 12 }).setHTML(popupHtml))
        .addTo(map);
    });
  }, [listo]);

  return (
    <div className="relative h-full w-full">
      <div ref={contenedorRef} className="h-full w-full" />

      <div className="absolute right-3 top-3 z-10">
        <button
          onClick={() => setPanelAbierto((v) => !v)}
          className="glass flex h-9 w-9 items-center justify-center rounded-xl text-ink"
          aria-label="Capas y controles del mapa"
          title="Capas y controles"
        >
          <Layers className="h-4 w-4" />
        </button>
        {panelAbierto && (
          <div className="glass absolute right-0 top-11 w-60 space-y-3 rounded-2xl p-3 text-sm">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Capa base</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    ["claro", "Clara"],
                    ["oscuro", "Oscura"],
                    ["satelite", "Satélite"],
                    ["topografico", "Topográfica"],
                  ] as [EstiloId, string][]
                ).map(([id, etiqueta]) => (
                  <button
                    key={id}
                    onClick={() => setEstilo(id)}
                    className={
                      "rounded-lg px-2 py-1.5 text-xs transition-colors " +
                      (estilo === id ? "bg-accent/20 text-accent" : "text-muted hover:bg-accent/5")
                    }
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-2">
              <button
                onClick={() => setRelieve3D((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs text-ink"
              >
                <span className="flex items-center gap-1.5">
                  <Mountain className="h-3.5 w-3.5 text-accent" />
                  Relieve 3D
                </span>
                <span
                  className={
                    "inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors " +
                    (relieve3D ? "bg-accent justify-end" : "bg-line justify-start")
                  }
                >
                  <span className="h-4 w-4 rounded-full bg-white" />
                </span>
              </button>
            </div>

            {relieve3D && (
              <div>
                <label className="mb-1 flex justify-between text-[11px] text-muted">
                  <span>Exageración vertical</span>
                  <span>{exageracion.toFixed(1)}×</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={exageracion}
                  onChange={(e) => setExageracion(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            )}

            <p className="border-t border-line pt-2 text-[10px] leading-relaxed text-muted">
              Terreno: AWS Open Data (Mapzen). Mapas: OpenFreeMap / Esri. Humedales: INEGI 2019.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
