"""Control del Tello para correr en Termux (Android) — línea por línea.

Pensado para teclado táctil: escribe una letra y Enter (no detecta teclas
mantenidas, es más cómodo para escribir en el celular que un control en
tiempo real). Usa tello_minimo.py — SIN djitellopy, SIN opencv/numpy/av
(esos no instalan de forma confiable en Termux). No hay video aquí: solo
control y telemetría de texto.

Instalar en Termux (una sola vez):
    pkg install python
    (no se necesita nada más — este script no tiene dependencias externas)

Correr:
    python control_termux.py

ANTES DE DESPEGAR:
  - Espacio abierto, sin gente ni mascotas cerca de las hélices.
  - No despega si la batería está debajo de 20%.
  - "x" = PARO DE EMERGENCIA: corta motores, el dron CAE. Solo para evitar
    un choque o lastimar a alguien — para terminar el vuelo usa "l".

Comandos (escribe la letra y Enter):
  t = despegar        l = aterrizar (normal)
  w / s = adelante / atrás      a / d = izquierda / derecha
  r / f = subir / bajar         q / e = girar izq. / der.
  bat = consultar batería
  x = PARO DE EMERGENCIA
  salir = terminar (aterriza primero si sigue en el aire)
"""

from tello_minimo import TelloMinimo

PASO_CM = 30
GIRO_GRADOS = 30
BATERIA_MINIMA_DESPEGUE = 20


def main():
    print(__doc__)

    tello = TelloMinimo()
    print("Conectando...")
    if not tello.conectar():
        print("No respondió. ¿Estás conectado a la red TELLO-XXXXXX?")
        return

    bateria = tello.bateria()
    print(f"Conectado. Batería: {bateria}%")

    volando = False

    try:
        while True:
            comando = input("\n> ").strip().lower()

            if comando == "salir":
                if volando:
                    print("Aterrizando antes de salir...")
                    tello.aterrizar()
                break

            elif comando == "x":
                print("¡PARO DE EMERGENCIA! El dron cae.")
                tello.emergencia()
                volando = False

            elif comando == "bat":
                print(f"Batería: {tello.bateria()}%")

            elif comando == "t":
                if volando:
                    print("Ya está en el aire.")
                    continue
                bateria = tello.bateria()
                if bateria is None or bateria < BATERIA_MINIMA_DESPEGUE:
                    print(f"Batería muy baja ({bateria}%) — no despego.")
                    continue
                print(f"Despegando (batería {bateria}%)...")
                volando = tello.despegar()

            elif comando == "l":
                if not volando:
                    print("No está en el aire.")
                    continue
                print("Aterrizando...")
                tello.aterrizar()
                volando = False

            elif not volando:
                print("Primero despega con 't'.")

            elif comando == "w":
                tello.mover("forward", PASO_CM)
            elif comando == "s":
                tello.mover("back", PASO_CM)
            elif comando == "a":
                tello.mover("left", PASO_CM)
            elif comando == "d":
                tello.mover("right", PASO_CM)
            elif comando == "r":
                tello.mover("up", PASO_CM)
            elif comando == "f":
                tello.mover("down", PASO_CM)
            elif comando == "q":
                tello.girar("ccw", GIRO_GRADOS)
            elif comando == "e":
                tello.girar("cw", GIRO_GRADOS)
            else:
                print("Comando no reconocido.")

    except KeyboardInterrupt:
        if volando:
            print("\nInterrumpido — aterrizando por seguridad...")
            tello.aterrizar()
    finally:
        tello.cerrar()


if __name__ == "__main__":
    main()
