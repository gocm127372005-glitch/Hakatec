"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type Props = { children: ReactNode; fallbackTitulo?: string };
type State = { error: Error | null };

// Aísla fallas de un widget (p. ej. el mapa WebGL) para que no se caiga el
// resto de la página — sidebar y demás paneles siguen funcionando aunque
// este componente truene con un error de JavaScript capturable.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 p-6 text-center">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-muted">
            {this.props.fallbackTitulo ?? "Este widget no pudo cargar."}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
