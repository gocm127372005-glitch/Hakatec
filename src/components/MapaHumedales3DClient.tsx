"use client";

import dynamic from "next/dynamic";

const MapaHumedales3D = dynamic(() => import("@/components/MapaHumedales3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
      Cargando mapa 3D…
    </div>
  ),
});

export default MapaHumedales3D;
