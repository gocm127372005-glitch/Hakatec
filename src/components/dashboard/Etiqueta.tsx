export function Etiqueta({
  tipo,
  fuente,
}: {
  tipo: "real" | "simulado" | "propuesto";
  /** Sustituye el sufijo de fuente por defecto (p. ej. "INEGI") cuando el dato viene de otro lado. */
  fuente?: string;
}) {
  const estilos = {
    real: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/20",
    simulado: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300 dark:ring-amber-500/20",
    propuesto: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300 dark:ring-sky-500/20",
  }[tipo];

  const punto = {
    real: "bg-emerald-500 dark:bg-emerald-400",
    simulado: "bg-amber-500 dark:bg-amber-400",
    propuesto: "bg-sky-500 dark:bg-sky-400",
  }[tipo];

  const texto = {
    real: `DATO REAL · ${fuente ?? "INEGI"}`,
    simulado: "SIMULADO · pendiente de sensores",
    propuesto: "PROPUESTO · no construido",
  }[tipo];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${estilos}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${punto}`} />
      {texto}
    </span>
  );
}
