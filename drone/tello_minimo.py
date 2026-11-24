"""Cliente mínimo del Tello — solo protocolo de texto por UDP, sin dependencias.

A diferencia de djitellopy, esto NO importa av/opencv/numpy (esos paquetes no
instalan de forma confiable en Termux/Android — av en particular no tiene
build para Android, está documentado que falla o truena en tiempo de
ejecución). Este módulo solo usa `socket`, que viene en cualquier Python.

Sin soporte de video — solo control y telemetría básica por texto. Es el
mismo protocolo (Tello SDK 2.0) que usa djitellopy por debajo: manda comandos
de texto a 192.168.10.1:8889 y espera "ok" o un valor de vuelta.
"""

import socket
import threading

# El SDK del Tello aterriza solo si no recibe NINGÚN comando en 15s (documentado
# oficialmente: Tello SDK 2.0 User Guide) — sin esto, el dron "se apaga" solo a
# los 15s de no tocar ningún botón. Se manda bien antes de ese límite.
INTERVALO_KEEPALIVE_SEGUNDOS = 5


class TelloMinimo:
    def __init__(self, timeout_segundos: float = 7.0):
        self.direccion = ("192.168.10.1", 8889)
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind(("", 8889))
        self.sock.settimeout(timeout_segundos)
        self._candado = threading.Lock()
        self._detener_keepalive = threading.Event()
        self._hilo_keepalive: threading.Thread | None = None

    def _enviar(self, comando: str) -> str | None:
        with self._candado:
            self.sock.sendto(comando.encode("utf-8"), self.direccion)
            try:
                datos, _ = self.sock.recvfrom(1024)
                return datos.decode("utf-8", errors="ignore").strip()
            except socket.timeout:
                return None

    def _bucle_keepalive(self):
        while not self._detener_keepalive.wait(INTERVALO_KEEPALIVE_SEGUNDOS):
            self._enviar("command")

    def conectar(self) -> bool:
        respuesta = self._enviar("command")
        conectado = respuesta == "ok"
        if conectado:
            self._hilo_keepalive = threading.Thread(target=self._bucle_keepalive, daemon=True)
            self._hilo_keepalive.start()
        return conectado

    def despegar(self) -> bool:
        return self._enviar("takeoff") == "ok"

    def aterrizar(self) -> bool:
        return self._enviar("land") == "ok"

    def emergencia(self):
        self._enviar("emergency")

    def mover(self, direccion: str, cm: int) -> bool:
        # direccion: "up", "down", "left", "right", "forward", "back"
        return self._enviar(f"{direccion} {cm}") == "ok"

    def girar(self, sentido: str, grados: int) -> bool:
        # sentido: "cw" (horario) o "ccw" (antihorario)
        return self._enviar(f"{sentido} {grados}") == "ok"

    def bateria(self) -> int | None:
        respuesta = self._enviar("battery?")
        try:
            return int(respuesta)
        except (TypeError, ValueError):
            return None

    def cerrar(self):
        self._detener_keepalive.set()
        if self._hilo_keepalive:
            self._hilo_keepalive.join(timeout=1)
        self.sock.close()


if __name__ == "__main__":
    tello = TelloMinimo()
    if not tello.conectar():
        print("No respondió 'ok' al conectar — revisa que estés en la red TELLO-XXXXXX.")
    else:
        print(f"Conectado. Batería: {tello.bateria()}%")
    tello.cerrar()
