"use client";

import dynamic from "next/dynamic";

const MapaHumedales = dynamic(() => import("@/components/MapaHumedales"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
      Cargando mapa…
    </div>
  ),
});

export default MapaHumedales;
