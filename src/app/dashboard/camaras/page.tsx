import { Camera } from "lucide-react";
import { PaginaPendiente } from "@/components/dashboard/PaginaPendiente";

export const metadata = { title: "Cámaras e IA — Atoyac" };

export default function CamarasPage() {
  return (
    <PaginaPendiente
      icono={Camera}
      titulo="Cámaras e inteligencia artificial"
      descripcion="0 cámaras registradas. No existe acceso a cámaras gubernamentales ni propias — no se simula detección de residuos sin una cámara real conectada."
      faltaPara={[
        "Una cámara (ESP32-CAM o webcam) apuntando a la maqueta del tramo de río",
        "Un script de visión (OpenCV, por color/contorno) que calcule % de superficie cubierta",
        "Autorización explícita si se usara infraestructura de videovigilancia gubernamental ya existente",
        "Definir el nivel de confianza mínimo antes de generar una alerta automática",
      ]}
    />
  );
}
