import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  etiqueta,
  valor,
  detalle,
  acento = "cyan",
}: {
  icon: LucideIcon;
  etiqueta: string;
  valor: string;
  detalle: string;
  acento?: "cyan" | "emerald" | "amber";
}) {
  const colores = {
    cyan: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20",
    amber:
      "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20",
  }[acento];

  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-sm dark:shadow-none">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${colores}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-2xl font-semibold tracking-tight text-ink">{valor}</p>
      <p className="text-sm text-muted">{etiqueta}</p>
      <p className="mt-1 text-xs text-muted/80">{detalle}</p>
    </div>
  );
}
