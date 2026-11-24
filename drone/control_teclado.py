"""Control manual del Tello por teclado — movimientos acotados, no continuos.

Cada tecla manda UN movimiento de tamaño fijo (no mantiene el vuelo mientras
la tecla está presionada) — es más predecible y seguro para una primera vez
con el dron real. Usa msvcrt (incluido en Python en Windows), no requiere
instalar nada más.

ANTES DE DESPEGAR — seguridad real, no solo de forma:
  - Espacio abierto, sin gente ni mascotas cerca, sin objetos frágiles.
  - Las hélices lastiman — no acerques las manos mientras gire.
  - Batería: este script NO deja despegar con menos de 20%.
  - "X" es PARO DE EMERGENCIA: corta motores al instante y el dron CAE, no
    aterriza controladamente. Solo úsalo si está a punto de chocar o lastimar
    a alguien — para terminar el vuelo normalmente usa "L" (aterrizar).

Controles:
  T = despegar          L = aterrizar (controlado)
  W / S = adelante / atrás      A / D = izquierda / derecha
  R / F = subir / bajar         Q / E = girar izq. / der.
  X = PARO DE EMERGENCIA (corta motores, el dron cae)
  ESC = salir (aterriza primero si sigue en el aire)
"""

import msvcrt
import sys
import time

from djitellopy import Tello

PASO_CM = 30
GIRO_GRADOS = 30
BATERIA_MINIMA_DESPEGUE = 20

AYUDA = __doc__


def main():
    print(AYUDA)

    tello = Tello()
    tello.connect()
    bateria = tello.get_battery()
    print(f"Batería actual: {bateria}%")

    volando = False

    print("\nListo. Presiona una tecla (ESC para salir)...\n")
    try:
        while True:
            if not msvcrt.kbhit():
                time.sleep(0.05)
                continue

            tecla = msvcrt.getch()
            if tecla in (b"\x00", b"\xe0"):
                msvcrt.getch()  # descarta el segundo byte de teclas especiales (flechas, etc.)
                continue

            tecla = tecla.decode(errors="ignore").lower()

            if tecla == "\x1b":  # ESC
                if volando:
                    print("Aterrizando antes de salir...")
                    tello.land()
                print("Saliendo.")
                break

            elif tecla == "x":
                print("¡PARO DE EMERGENCIA! Motores cortados — el dron cae.")
                tello.emergency()
                volando = False

            elif tecla == "t":
                if volando:
                    print("Ya está en el aire.")
                    continue
                bateria = tello.get_battery()
                if bateria < BATERIA_MINIMA_DESPEGUE:
                    print(f"Batería muy baja ({bateria}%) — no despego. Carga el dron primero.")
                    continue
                print(f"Despegando (batería {bateria}%)...")
                tello.takeoff()
                volando = True

            elif tecla == "l":
                if not volando:
                    print("No está en el aire.")
                    continue
                print("Aterrizando...")
                tello.land()
                volando = False

            elif not volando:
                print("Primero despega con T.")

            elif tecla == "w":
                tello.move_forward(PASO_CM)
            elif tecla == "s":
                tello.move_back(PASO_CM)
            elif tecla == "a":
                tello.move_left(PASO_CM)
            elif tecla == "d":
                tello.move_right(PASO_CM)
            elif tecla == "r":
                tello.move_up(PASO_CM)
            elif tecla == "f":
                tello.move_down(PASO_CM)
            elif tecla == "q":
                tello.rotate_counter_clockwise(GIRO_GRADOS)
            elif tecla == "e":
                tello.rotate_clockwise(GIRO_GRADOS)

    except KeyboardInterrupt:
        if volando:
            print("\nInterrumpido — aterrizando por seguridad...")
            tello.land()
    except Exception as exc:
        print(f"\nError: {exc}")
        if volando:
            print("Intentando aterrizar por seguridad...")
            try:
                tello.land()
            except Exception:
                print("No se pudo aterrizar solo — usa el control físico/app si es necesario.")
        sys.exit(1)


if __name__ == "__main__":
    main()
