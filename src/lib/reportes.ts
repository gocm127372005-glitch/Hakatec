export const TIPOS_REPORTE = [
  "Basura acumulada en el río",
  "Descarga de aguas residuales",
  "Mal olor",
  "Lirio acuático / plantas invasoras",
  "Posible desbordamiento",
  "Otro",
] as const;

export type TipoReporte = (typeof TIPOS_REPORTE)[number];

export const ESTADOS_REPORTE = ["borrador", "recibido", "asignado", "atendido"] as const;

export type EstadoReporte = (typeof ESTADOS_REPORTE)[number];

export const ETIQUETA_ESTADO: Record<EstadoReporte, string> = {
  borrador: "Borrador (incompleto)",
  recibido: "Recibido",
  asignado: "En revisión",
  atendido: "Atendido",
};

export const COLOR_ESTADO: Record<EstadoReporte, string> = {
  borrador: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/20 dark:text-zinc-300",
  recibido: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  asignado: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300",
  atendido: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
};
