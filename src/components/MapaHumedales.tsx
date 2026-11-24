"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { humedalesAltoAtoyac } from "@/data/humedales";

const CENTRO_CUENCA: [number, number] = [19.2, -98.2];

export default function MapaHumedales() {
  const { resolvedTheme } = useTheme();
  const [montado, setMontado] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- evita desajuste de hidratación con el tema
    setMontado(true);
  }, []);

  const oscuro = montado ? resolvedTheme === "dark" : true;
  const capaBase = oscuro
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";

  return (
    <MapContainer
      center={CENTRO_CUENCA}
      zoom={9}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        key={capaBase}
        attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS"
        url={capaBase}
      />
      {humedalesAltoAtoyac.map((h) => (
        <CircleMarker
          key={h.id}
          center={[h.lat, h.lng]}
          radius={9}
          pathOptions={{
            color: h.sitioRamsar ? "#22d3ee" : "#34d399",
            weight: 2,
            fillColor: h.sitioRamsar ? "#22d3ee" : "#34d399",
            fillOpacity: 0.35,
          }}
        >
          <Popup>
            <div className="min-w-[180px] space-y-1 text-sm">
              <p className="font-semibold">{h.nombre}</p>
              <p>{h.municipios}, {h.estado}</p>
              <p>Área: {h.areaKm2} km²</p>
              {h.sitioRamsar && <p className="text-sky-600">Sitio RAMSAR</p>}
              {h.lirioAcuaticoPorcentaje !== null && (
                <p>Lirio acuático: {h.lirioAcuaticoPorcentaje}% de la superficie</p>
              )}
              {h.agua && (
                <div className="mt-1 border-t pt-1">
                  <p>pH: {h.agua.pH}</p>
                  <p>Conductividad: {h.agua.conductividad_mS_cm} mS/cm</p>
                  <p>STD: {h.agua.solidosDisueltosTotales_mgL} mg/l</p>
                  <p>O₂ disuelto: {h.agua.oxigenoDisuelto_mgL} mg/l</p>
                </div>
              )}
              <p className="mt-1 text-xs text-zinc-500">Fuente: {h.fuente}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
