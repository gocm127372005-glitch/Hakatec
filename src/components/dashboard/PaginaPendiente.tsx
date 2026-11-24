import type { LucideIcon } from "lucide-react";

export function PaginaPendiente({
  icono: Icono,
  titulo,
  descripcion,
  faltaPara,
}: {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  faltaPara: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-line bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
        <Icono className="h-6 w-6 text-accent" />
      </div>
      <h1 className="text-lg font-semibold text-ink">{titulo}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{descripcion}</p>
      <div className="mx-auto mt-5 max-w-sm rounded-lg border border-line bg-bg p-4 text-left">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Para activar este módulo falta
        </p>
        <ul className="space-y-1.5 text-sm text-ink">
          {faltaPara.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
