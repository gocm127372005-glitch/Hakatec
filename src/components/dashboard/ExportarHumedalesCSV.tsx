"use client";

import { Download } from "lucide-react";
import { humedalesAltoAtoyac } from "@/data/humedales";

function construirCSV(): string {
  const encabezados = [
    "nombre",
    "estado",
    "municipios",
    "lat",
    "lng",
    "areaKm2",
    "sistema",
    "sitioRamsar",
    "lirioAcuaticoPorcentaje",
    "pH",
    "conductividad_mS_cm",
    "solidosDisueltosTotales_mgL",
    "oxigenoDisuelto_mgL",
    "fuente",
  ];
  const filas = humedalesAltoAtoyac.map((h) =>
    [
      h.nombre,
      h.estado,
      h.municipios,
      h.lat,
      h.lng,
      h.areaKm2,
      h.sistema,
      h.sitioRamsar ? "si" : "no",
      h.lirioAcuaticoPorcentaje ?? "",
      h.agua?.pH ?? "",
      h.agua?.conductividad_mS_cm ?? "",
      h.agua?.solidosDisueltosTotales_mgL ?? "",
      h.agua?.oxigenoDisuelto_mgL ?? "",
      h.fuente,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [encabezados.join(","), ...filas].join("\n");
}

export function ExportarHumedalesCSV() {
  const descargar = () => {
    const csv = construirCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humedales-alto-atoyac-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={descargar}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1 text-xs font-medium text-ink hover:bg-accent/5"
    >
      <Download className="h-3.5 w-3.5" />
      Exportar CSV
    </button>
  );
}
