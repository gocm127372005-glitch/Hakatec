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

    // Safari reproduce HLS de forma nativa; el resto de navegadores necesita hls.js.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evento, datos) => {
        if (datos.fatal) {
          setError("No se pudo conectar con la transmisión de la cámara.");
        }
      });
      return () => hls.destroy();
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- el soporte de HLS solo se puede saber tras montar, no se deriva de props
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
