"""Captura fotos del Tello con metadatos listos para subir a ATOYAC Look Around.

El Tello NO tiene GPS — su único sensor de orientación es un IMU relativo
(deriva con el tiempo, no es una brújula real), así que las coordenadas y el
rumbo verdadero los tienes que dar tú (p. ej. el punto fijo desde donde
despegas). No se inventa esa parte: se pide como argumento.

Uso:
  .venv\\Scripts\\python.exe captura_fotos.py --lat 18.92 --lng -98.17 --fuente "Dron DJI Tello, HackaTec 2026"

Controles durante la captura:
  [ESPACIO] guarda una foto con metadatos (capturas/AAAAMMDD_HHMMSS.jpg + .json)
  [Q]       sale sin aterrizar nada (el dron nunca despega con este script)
"""

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

import cv2
from djitellopy import Tello

CARPETA_CAPTURAS = Path(__file__).parent / "capturas"


def main():
    parser = argparse.ArgumentParser(description="Captura fotos georreferenciadas desde el Tello.")
    parser.add_argument("--lat", type=float, required=True, help="Latitud del punto de despegue")
    parser.add_argument("--lng", type=float, required=True, help="Longitud del punto de despegue")
    parser.add_argument("--fuente", default="Dron DJI Tello", help="Texto de fuente/atribución")
    args = parser.parse_args()

    CARPETA_CAPTURAS.mkdir(exist_ok=True)

    tello = Tello()
    tello.connect()
    print(f"Batería: {tello.get_battery()}%")

    tello.streamon()
    lector = tello.get_frame_read()

    print("Ventana de video abierta. ESPACIO = capturar, Q = salir.")
    try:
        while True:
            cuadro = lector.frame
            if cuadro is None:
                continue
            cuadro_bgr = cv2.cvtColor(cuadro, cv2.COLOR_RGB2BGR)
            cv2.imshow("Tello - ATOYAC Look Around", cuadro_bgr)

            tecla = cv2.waitKey(1) & 0xFF
            if tecla == ord("q"):
                break
            if tecla == ord(" "):
                ahora = datetime.now(timezone.utc)
                nombre_base = ahora.strftime("%Y%m%d_%H%M%S")
                ruta_jpg = CARPETA_CAPTURAS / f"{nombre_base}.jpg"
                ruta_json = CARPETA_CAPTURAS / f"{nombre_base}.json"

                cv2.imwrite(str(ruta_jpg), cuadro_bgr)
                metadatos = {
                    "archivo": ruta_jpg.name,
                    "fechaUtc": ahora.isoformat(),
                    "lat": args.lat,
                    "lng": args.lng,
                    "tipo": "aerea",
                    "orientacionRelativaGrados": {
                        "yaw": tello.get_yaw(),
                        "pitch": tello.get_pitch(),
                        "roll": tello.get_roll(),
                    },
                    "alturaBarometricaCm": tello.get_height(),
                    "fuente": args.fuente,
                    "nota": "Coordenadas del punto de despegue dadas manualmente — el Tello no tiene GPS. Orientación es IMU relativa, no brújula real.",
                }
                ruta_json.write_text(json.dumps(metadatos, indent=2, ensure_ascii=False), encoding="utf-8")
                print(f"Guardado: {ruta_jpg.name}")
    finally:
        tello.streamoff()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
