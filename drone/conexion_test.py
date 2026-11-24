"""Prueba de conexión con el DJI/Ryze Tello — no hace volar el dron.

Antes de correr esto:
1. Enciende el Tello y espera a que el LED parpadee en ámbar/naranja.
2. En la PC, conéctate por WiFi a la red del propio dron: "TELLO-XXXXXX"
   (la crea el dron, no tiene contraseña). Mientras estés conectado a esa
   red, la PC pierde el internet normal, a menos que tengas una segunda
   conexión (ethernet o un hotspot USB del celular) — el Tello base no
   tiene forma de "unirse" a tu WiFi de casa, crea su propia red aislada.
3. Corre: .venv\\Scripts\\python.exe conexion_test.py
"""

from djitellopy import Tello

tello = Tello()
tello.connect()

print(f"Batería: {tello.get_battery()}%")
print(f"Temperatura: {tello.get_temperature()} °C")
print(f"Altura (barómetro): {tello.get_height()} cm")
print(f"Distancia al suelo (ToF): {tello.get_distance_tof()} cm")
