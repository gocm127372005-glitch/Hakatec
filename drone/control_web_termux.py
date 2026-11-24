"""Control del Tello con botones táctiles, corriendo dentro de Termux.

En vez de escribir letras, abre una página con botones grandes en el propio
navegador de tu celular. Sigue siendo 100% Termux — el navegador solo habla
con este mismo proceso en localhost (eso sí lo puede hacer un navegador,
a diferencia de hablar directo con el Tello por UDP). Solo usa `http.server`
de la librería estándar de Python — nada que instalar.

Correr en Termux:
    python control_web_termux.py

Luego abre, en el navegador del MISMO celular:
    http://127.0.0.1:8080

ANTES DE DESPEGAR:
  - Espacio abierto, sin gente ni mascotas cerca de las hélices.
  - No despega con batería debajo de 20%.
  - El botón rojo "PARO" corta motores al instante — el dron CAE, no
    aterriza. Solo para evitar un choque o lastimar a alguien.
"""

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from tello_minimo import TelloMinimo

PASO_CM = 30
GIRO_GRADOS = 30
BATERIA_MINIMA_DESPEGUE = 20
PUERTO = 8080

tello: TelloMinimo | None = None
volando = False

PAGINA_HTML = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<title>ATOYAC — Control del dron</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0; padding: 16px; background: #0b1017; color: #e8eef5;
    font-family: -apple-system, system-ui, sans-serif; user-select: none;
    -webkit-user-select: none; -webkit-tap-highlight-color: transparent;
  }
  h1 { font-size: 18px; margin: 0 0 4px; }
  #estado { font-size: 13px; color: #8ba0b5; margin-bottom: 16px; min-height: 18px; }
  .fila { display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; }
  button {
    font-size: 15px; font-weight: 600; padding: 18px 0; width: 86px;
    border-radius: 14px; border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06); color: #e8eef5;
  }
  button:active { background: rgba(56,189,248,.35); }
  .ancho { width: 182px; }
  .despegar { background: rgba(94,234,212,.18); border-color: rgba(94,234,212,.4); }
  .aterrizar { background: rgba(56,189,248,.18); border-color: rgba(56,189,248,.4); }
  .paro { background: #ef4444; border-color: #ef4444; color: white; width: 100%; padding: 22px 0; margin-top: 18px; }
  .separador { height: 1px; background: rgba(255,255,255,.1); margin: 18px 0; }
</style>
</head>
<body>
  <h1>ATOYAC — Control del dron</h1>
  <div id="estado">Conectando...</div>

  <div class="fila"><button class="ancho despegar" onclick="accion('despegar')">DESPEGAR</button></div>
  <div class="fila"><button class="ancho aterrizar" onclick="accion('aterrizar')">ATERRIZAR</button></div>

  <div class="separador"></div>

  <div class="fila"><button onclick="accion('forward')">▲ adelante</button></div>
  <div class="fila">
    <button onclick="accion('left')">◀ izq.</button>
    <button onclick="accion('back')">▼ atrás</button>
    <button onclick="accion('right')">der. ▶</button>
  </div>

  <div class="separador"></div>

  <div class="fila">
    <button onclick="accion('up')">▲ subir</button>
    <button onclick="accion('down')">▼ bajar</button>
  </div>
  <div class="fila">
    <button onclick="accion('ccw')">↺ girar izq.</button>
    <button onclick="accion('cw')">girar der. ↻</button>
  </div>

  <button class="paro" onclick="accion('emergencia')">PARO DE EMERGENCIA</button>

<script>
async function accion(tipo) {
  const estado = document.getElementById('estado');
  estado.textContent = 'Enviando: ' + tipo + '...';
  try {
    const r = await fetch('/accion?tipo=' + tipo);
    const datos = await r.json();
    estado.textContent = datos.mensaje + (datos.bateria !== null ? ' · Batería: ' + datos.bateria + '%' : '');
  } catch (e) {
    estado.textContent = 'Error de red: ' + e;
  }
}
async function actualizarBateria() {
  try {
    const r = await fetch('/accion?tipo=bateria');
    const datos = await r.json();
    document.getElementById('estado').textContent = datos.mensaje;
  } catch (e) {}
}
actualizarBateria();
setInterval(actualizarBateria, 15000);
</script>
</body>
</html>
"""


class Manejador(BaseHTTPRequestHandler):
    def log_message(self, formato, *args):
        pass  # silencia el log de cada petición en consola

    def _responder_json(self, cuerpo: dict):
        datos = json.dumps(cuerpo).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(datos)))
        self.end_headers()
        self.wfile.write(datos)

    def do_GET(self):
        global volando

        if self.path == "/" or self.path == "":
            cuerpo = PAGINA_HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(cuerpo)))
            self.end_headers()
            self.wfile.write(cuerpo)
            return

        if not self.path.startswith("/accion?tipo="):
            self.send_response(404)
            self.end_headers()
            return

        tipo = self.path.split("=", 1)[1]
        mensaje = ""
        bateria = None

        if tipo == "bateria":
            bateria = tello.bateria()
            mensaje = "Lista." if bateria is not None else "Sin respuesta del dron."

        elif tipo == "emergencia":
            tello.emergencia()
            volando = False
            mensaje = "¡PARO DE EMERGENCIA enviado!"

        elif tipo == "despegar":
            if volando:
                mensaje = "Ya está en el aire."
            else:
                bateria = tello.bateria()
                if bateria is None or bateria < BATERIA_MINIMA_DESPEGUE:
                    mensaje = f"Batería muy baja ({bateria}%) — no despego."
                else:
                    volando = tello.despegar()
                    mensaje = "Despegando..." if volando else "No pudo despegar."

        elif tipo == "aterrizar":
            if not volando:
                mensaje = "No está en el aire."
            else:
                tello.aterrizar()
                volando = False
                mensaje = "Aterrizando..."

        elif not volando:
            mensaje = "Primero despega."

        elif tipo in ("forward", "back", "left", "right", "up", "down"):
            tello.mover(tipo, PASO_CM)
            mensaje = f"Moviendo: {tipo}"

        elif tipo in ("cw", "ccw"):
            tello.girar(tipo, GIRO_GRADOS)
            mensaje = f"Girando: {tipo}"

        else:
            mensaje = "Comando desconocido."

        self._responder_json({"mensaje": mensaje, "bateria": bateria})


def main():
    global tello
    print("Conectando con el Tello...")
    tello = TelloMinimo()
    if not tello.conectar():
        print("No respondió. ¿Estás conectado a la red TELLO-XXXXXX?")
        return
    print(f"Conectado. Batería: {tello.bateria()}%")

    servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), Manejador)
    print(f"\nAbre en el navegador de este mismo celular: http://127.0.0.1:{PUERTO}")
    print("Ctrl+C para salir (si sigue volando, aterriza primero desde la página).")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        if volando:
            print("Aterrizando por seguridad...")
            tello.aterrizar()
        tello.cerrar()


if __name__ == "__main__":
    main()
