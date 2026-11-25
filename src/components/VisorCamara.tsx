"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export function VisorCamara({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);

    // hls.js primero (más control, mejor manejo de errores) — es el orden
    // que la propia librería recomienda. El <video> nativo solo se usa de
    // respaldo para navegadores donde hls.js no corre (iOS Safari, que no
    // permite Media Source Extensions a terceros).
    if (Hls.isSupported()) {
      // lowLatencyMode + un buffer de sincronización corto reducen el
      // delay de "en vivo" a costa de tolerar menos variaciones de red.
      const hls = new Hls({ lowLatencyMode: true, liveSyncDurationCount: 2 });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evento, datos) => {
        if (datos.fatal) {
          setError("No se pudo conectar con la transmisión de la cámara.");
        }
      });
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    setError("Este navegador no puede reproducir la transmisión (HLS).");
  }, [url]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">
        {error}
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      playsInline
      className="h-full w-full bg-black object-contain"
    />
  );
}
