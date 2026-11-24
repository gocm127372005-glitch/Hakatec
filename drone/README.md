# Dron (DJI/Ryze Tello) — ATOYAC

Módulo aparte en Python (no forma parte del dashboard Next.js) para conectar,
probar y capturar fotos georreferenciadas con el Tello. Verificado: instala y
corre con Python 3.14 en Windows.

## Preparar el entorno (una sola vez)

```powershell
cd drone
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Realidad de red — léelo antes de volar

El Tello **crea su propia red WiFi** (`TELLO-XXXXXX`, sin contraseña) y **no
tiene forma de unirse a tu WiFi de casa ni tiene internet propio**. Mientras
tu laptop esté conectada a esa red para controlar el dron, pierde tu internet
normal — a menos que tengas una segunda conexión (cable ethernet, o
tethering USB del celular). Esto importa para la integración con el
dashboard: no hay forma de que el Tello suba nada "en vivo" a Supabase/Vercel
directamente. El flujo real es:

```
Tello (WiFi propio, sin internet)
   → laptop conectada a esa red, corriendo este script
   → fotos + metadatos guardados localmente en drone/capturas/
   → (paso aparte, manual) subirlas a través de "ATOYAC Look Around"
     una vez reconectada la laptop a internet
```

No hay telemetría en vivo al dashboard con el Tello base — es captura local,
subida después. Esto es correcto para una demo de hackathon (vuelas, aterrizas,
reconectas a internet, subes las fotos).

## Scripts

- **`conexion_test.py`** — conecta y muestra batería/temperatura/altura. No
  hace volar el dron. Córrelo primero para confirmar que todo está bien
  antes de intentar nada más.
- **`captura_fotos.py`** — abre el video en vivo y captura fotos con
  ESPACIO, guardando un `.json` con fecha, coordenadas (las que tú le des —
  el Tello no tiene GPS), orientación relativa (IMU, no brújula real) y
  fuente. No hace despegar el dron.
- **`control_teclado.py`** — vuelo manual por teclado, con movimientos
  acotados (no continuos) por seguridad. Usa `msvcrt` (incluido en Python,
  no `pygame` — no tiene build todavía para Python 3.14 en Windows). No
  despega si la batería está debajo de 20%. Lee el aviso de seguridad dentro
  del archivo antes de usarlo.

```powershell
.venv\Scripts\python.exe conexion_test.py
.venv\Scripts\python.exe captura_fotos.py --lat 18.92 --lng -98.17 --fuente "Dron DJI Tello, HackaTec 2026"
.venv\Scripts\python.exe control_teclado.py
```

## Control desde el celular (Xiaomi/Android, por Termux)

`djitellopy` importa `av` (decodificación de video) siempre, incluso si no
usas video — y `av` no tiene build confiable para Termux/Android (está
documentado que falla al compilar o truena en tiempo de ejecución, porque
Android usa una libc distinta a la de Linux normal). Por eso para el celular
hay dos archivos aparte, **sin esa dependencia**:

- **`tello_minimo.py`** — cliente del protocolo del Tello usando solo
  `socket` (viene en cualquier Python). Sin video.
- **`control_termux.py`** — control por línea de comandos (escribes una
  letra y Enter — más cómodo para teclado táctil que una tecla mantenida).
  Mismas protecciones de seguridad que `control_teclado.py`.

### Instalar Termux

1. Instala **Termux desde F-Droid**, no desde la Play Store (la versión de
   Play Store está descontinuada y ya no se actualiza).
2. Dentro de Termux: `pkg install python git`
3. Clona el proyecto: `git clone https://github.com/gocm127372005-glitch/Hakatec.git`
4. `cd Hakatec/drone`
5. `python control_termux.py`

### Para que MIUI no mate el proceso

Xiaomi/HyperOS cierra apps en segundo plano de forma agresiva. Antes de
volar:
- Ajustes → Apps → Termux → Batería → **Sin restricciones**.
- Ajustes → Permisos → Autoinicio → activa Termux.
- Dejas Termux abierto en primer plano durante el vuelo (no lo mandes a
  segundo plano) — así evitas depender de que MIUI no lo mate.

### Qué SÍ y qué NO hace esta ruta

- ✅ Controlar el dron desde el celular, con la laptop libre en tu WiFi
  normal viendo el dashboard.
- ✅ Consultar batería en vivo desde el propio celular.
- ❌ Video en vivo desde el celular (por el problema de `av` en Termux) —
  el video sigue siendo cosa de la laptop con `captura_fotos.py`, después
  del vuelo.
- ⚠️ No lo he podido probar en un Xiaomi real — verificado que compila y
  que el protocolo es el mismo que ya funcionó en tus pruebas de Windows,
  pero el comportamiento exacto de MIUI con Termux puede variar.

## Qué falta para integrarlo al dashboard

Las fotos y `.json` que genera `captura_fotos.py` usan el mismo esquema
(`tipo: "aerea"`, lat/lng, fecha, orientación, fuente) que necesita la
función "ATOYAC Look Around" del dashboard (fotos propias georreferenciadas,
ver requisito #12). Falta construir esa parte del dashboard para poder
subirlas — todavía no existe.
