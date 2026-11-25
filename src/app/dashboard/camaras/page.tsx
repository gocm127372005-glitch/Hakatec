import { Camera } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";
import { Panel } from "@/components/dashboard/Panel";
import { VisorCamara } from "@/components/VisorCamara";

export const metadata = { title: "Cámaras e IA — Atoyac" };

export default function CamarasPage() {
  const streamUrl = process.env.NEXT_PUBLIC_CAMARA_STREAM_URL;

  if (!streamUrl) {
    return (
      <PaginaPendiente
        icono={Camera}
        titulo="Cámaras e inteligencia artificial"
        descripcion="Hay una cámara (TP-Link Tapo C520WS) pero todavía no hay transmisión configurada — falta levantar el relay RTSP→HLS y apuntar NEXT_PUBLIC_CAMARA_STREAM_URL a su URL."
        faltaPara={[
          "Activar 'Cuenta de cámara' (RTSP local) desde la app Tapo y anotar usuario/contraseña",
          "Correr MediaMTX en una computadora de la misma red, apuntando a la cámara por RTSP",
          "Configurar NEXT_PUBLIC_CAMARA_STREAM_URL con la URL HLS que expone MediaMTX",
          "Un script de visión (OpenCV) que calcule % de superficie cubierta, para la siguiente etapa",
        ]}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Cámaras e inteligencia artificial</h1>
        <p className="text-sm text-muted">
          Transmisión en vivo de la cámara apuntando al tramo de río o la maqueta.
        </p>
      </div>
      <Panel titulo="Cámara 1 — TP-Link Tapo C520WS" icono={Camera} etiqueta="real" fuenteEtiqueta="RTSP">
        <div className="aspect-video overflow-hidden rounded-lg border border-line bg-black">
          <VisorCamara url={streamUrl} />
        </div>
      </Panel>
    </div>
  );
}
