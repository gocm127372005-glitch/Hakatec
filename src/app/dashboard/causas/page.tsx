import { Factory, Droplets, Sprout, FlaskConical, ScrollText, Radar } from "lucide-react";
import { Panel } from "@/components/dashboard/Panel";
import { GraficaGirosIndustriales } from "@/components/GraficaGirosIndustriales";
import {
  categoriasFuente,
  parametrosExcedidosOrden,
  fuentesCitadas,
} from "@/data/causas-contaminacion";

export const metadata = { title: "Causas de contaminación — Atoyac" };

const iconoCategoria = {
  "Industrial puntual": Factory,
  "Municipal / doméstica": Droplets,
  Agropecuaria: Sprout,
} as const;

export default function CausasContaminacionPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Causas documentadas de contaminación</h1>
        <p className="text-sm text-muted">
          No es &ldquo;solo basura&rdquo;: esta página clasifica las causas reales de
          contaminación en la cuenca del Alto Atoyac, con fuente citada para cada dato.
        </p>
      </div>

      <Panel titulo="Tres categorías de causa" icono={ScrollText} etiqueta="real" fuenteEtiqueta="IMTA/UNAM, 2006">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {categoriasFuente.map((c) => {
            const Icono = iconoCategoria[c.categoria as keyof typeof iconoCategoria];
            return (
              <div key={c.categoria} className="rounded-xl border border-line bg-bg p-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <Icono className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium text-ink">{c.categoria}</p>
                </div>
                <p className="text-xs text-muted">{c.descripcion}</p>
                <p className="mt-2 text-[11px] text-muted/80">{c.evidencia}</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        titulo="Giros industriales en la subcuenca"
        icono={Factory}
        etiqueta="real"
        fuenteEtiqueta="IMTA/UNAM, 2006 (padrón 1999)"
      >
        <p className="mb-2 text-sm text-muted">
          Porcentaje de descargas industriales registradas por giro. El giro
          textil es además el de mayor volumen (48 descargas, ≈6,340 m³/día) y
          el que con más frecuencia rebasa la norma.
        </p>
        <GraficaGirosIndustriales />
        <p className="mt-2 text-[11px] text-muted">
          De 23 descargas industriales muestreadas a detalle, 18 (78%)
          incumplían la NOM-001-SEMARNAT-1996 y 17 de las tóxicas (46%) eran
          del giro textil — el resto (37%) de giros metalúrgico, químico,
          farmacéutico y alimenticio, entre otros.
        </p>
      </Panel>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Panel
          titulo="Parámetros que más se exceden"
          icono={FlaskConical}
          etiqueta="real"
          fuenteEtiqueta="IMTA/UNAM, 2006"
        >
          <p className="mb-2 text-sm text-muted">En orden de frecuencia, según el muestreo:</p>
          <ol className="space-y-1 text-sm text-ink">
            {parametrosExcedidosOrden.map((p, i) => (
              <li key={p} className="flex items-baseline gap-2">
                <span className="text-xs text-muted">{i + 1}.</span>
                {p}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">
            El color del agua (rojo, amarillo, azul marino durante el
            muestreo) no está regulado por la norma, pero fue un indicador
            visual claro de descargas textiles.
          </p>
        </Panel>

        <Panel titulo="Vigencia actual (2025)" icono={Radar} etiqueta="real" fuenteEtiqueta="Conahcyt / prensa, 2025">
          <p className="text-sm text-muted">
            El gobierno federal reconoce a la cuenca del Alto Atoyac como{" "}
            <strong className="text-ink">
              Región de Emergencia Sanitaria y Ambiental (RESA)
            </strong>{" "}
            por daños a la salud asociados a la exposición a tóxicos
            industriales.
          </p>
          <p className="mt-2 text-sm text-muted">
            Según notas de prensa que citan a CONAGUA, las descargas
            irregulares identificadas en el río Atoyac aumentaron 160% en
            2025 (mil 95 identificadas) — confirma que el problema sigue
            activo, aunque esta cifra no desglosa por giro industrial.
          </p>
          <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">
            Dato histórico (1999–2006) vs. vigente (2025): el reparto por
            giro es estructural, no se ha vuelto a medir con este detalle.
          </p>
        </Panel>
      </div>

      <Panel
        titulo="Cómo lo detectaría el prototipo"
        icono={Radar}
        etiqueta="propuesto"
      >
        <p className="mb-2 text-sm text-muted">
          Clasificación por patrón de lecturas (reglas simples en el ESP32,
          no IA) — no identifica a la empresa responsable, solo el tipo de
          causa más probable:
        </p>
        <ul className="space-y-1.5 text-sm text-ink">
          <li>
            <strong>Conductividad alta + pH fuera de 6.5–8.5 + color anómalo</strong>{" "}
            → patrón industrial/químico (ej. tintes textiles, según el color
            documentado arriba).
          </li>
          <li>
            <strong>Turbidez alta + conductividad y color normales</strong> →
            patrón orgánico/doméstico (materia orgánica, drenaje sin tratar).
          </li>
          <li>
            <strong>Acumulación en la malla sin cambios en el agua</strong> →
            solo sólidos/basura flotante, sin indicio químico.
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-muted">
          Requiere agregar un sensor de color (p. ej. TCS34725, ~$3–5 USD) a
          los sensores ya contemplados. Sin hardware construido todavía — no
          se muestra como dato real hasta calibrarse.
        </p>
      </Panel>

      <Panel titulo="Fuentes citadas" icono={ScrollText} etiqueta="real" fuenteEtiqueta="ver detalle">
        <ul className="space-y-2 text-xs">
          {fuentesCitadas.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noreferrer" className="text-accent underline">
                {f.titulo}
              </a>
              <p className="text-muted">{f.nota}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
