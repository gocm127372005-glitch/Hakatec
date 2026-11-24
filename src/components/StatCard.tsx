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
    cyan: "bg-accent/10 text-accent ring-accent/20",
    emerald: "bg-accent2/10 text-accent2 ring-accent2/20",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-300",
  }[acento];

  return (
    <div className="glass rounded-2xl p-4">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ${colores}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-2xl font-semibold tracking-tight text-ink">{valor}</p>
      <p className="text-sm text-muted">{etiqueta}</p>
      <p className="mt-1 text-xs text-muted/80">{detalle}</p>
    </div>
  );
}
