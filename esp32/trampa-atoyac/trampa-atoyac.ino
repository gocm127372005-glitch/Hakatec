// Trampa ESP32 — Atoyac
// LilyGO T3 (OLED SSD1306 por I2C) + termistor NTC (IO34) + buzzer pasivo (IO25).
//
// Envía telemetría por WiFi a la tabla "lecturas_sensores" de Supabase cada
// INTERVALO_SENSORES_MS. El nivel de agua (sensor ultrasónico) todavía se
// SIMULA con una onda triangular hasta instalar el sensor real; pH, turbidez
// y conductividad se derivan matemáticamente de ese nivel simulado. La
// temperatura del NTC sí es una lectura real del hardware.
//
// Librerías necesarias (Arduino IDE → Administrador de bibliotecas):
//   - Adafruit SSD1306
//   - Adafruit GFX Library
//   (WiFi.h y HTTPClient.h ya vienen incluidas en el core de ESP32)

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ---------- WiFi ----------
// IMPORTANTE: el ESP32 (y el chip del LilyGO T3) solo tiene radio de 2.4 GHz,
// NO soporta redes de 5 GHz. Si tu red es dual-band ("...-5G" / "...5G" es
// casi siempre el nombre de la banda de 5 GHz), usa el SSID de la banda de
// 2.4 GHz en vez de ese — si no, el ESP32 ni siquiera la va a ver al escanear.
const char* WIFI_SSID = "TU_RED_WIFI_2.4GHZ";
const char* WIFI_PASSWORD = "TU_CONTRASENA_WIFI";

// ---------- Supabase ----------
// La "anon key" es pública por diseño (se usa igual en el navegador desde el
// dashboard web), así que es seguro dejarla escrita aquí en el firmware.
const char* SUPABASE_URL = "https://hqgixqhuchxgtixagzyq.supabase.co";
const char* SUPABASE_ANON_KEY = "sb_publishable_bFQ11CUdRLGfswa5AI-jgg_y8C22f4r";
const char* DISPOSITIVO_ID = "trampa-01";

// ---------- Pines ----------
#define PIN_SDA 21
#define PIN_SCL 22
#define PIN_NTC 34
#define PIN_BUZZER 25

#define OLED_ANCHO 128
#define OLED_ALTO 64
Adafruit_SSD1306 pantalla(OLED_ANCHO, OLED_ALTO, &Wire, -1);

// ---------- NTC (ecuación beta de Steinhart-Hart) ----------
const float NTC_BETA = 3950.0;
const float NTC_R0 = 10000.0;
const float NTC_T0_K = 298.15; // 25°C en Kelvin
const float NTC_R_SERIE = 10000.0;

// ---------- Simulación de distancia (hasta tener el ultrasónico real) ----------
const float DIST_MIN_CM = 70.0;
const float DIST_MAX_CM = 140.0;
float distanciaActualCm = DIST_MIN_CM;
int direccionDistancia = 1; // 1 = sube, -1 = baja

// ---------- Estado derivado de la última lectura completa ----------
float factorAcum = 0.0; // 0..1 (0 = nivel bajo, 1 = acumulación alta)
const char* estadoActual = "normal";
float tempC = NAN;
float phVal = 0.0;
float turbVal = 0.0;
float condVal = 0.0;
bool alertaBuzzer = false;

// ---------- Tiempos ----------
const unsigned long INTERVALO_DISTANCIA_MS = 1200;
const unsigned long INTERVALO_SENSORES_MS = 4500;
unsigned long ultimoCambioDistanciaMs = 0;
unsigned long ultimoCambioSensoresMs = 0;

void conectarWifi() {
  if (WiFi.status() == WL_CONNECTED) return;

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a WiFi");

  unsigned long inicio = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - inicio < 15000) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi conectado, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("No se pudo conectar a WiFi (se reintenta en el próximo ciclo).");
  }
}

float leerTemperaturaNTC() {
  int lecturaAdc = analogRead(PIN_NTC);
  if (lecturaAdc <= 0 || lecturaAdc >= 4095) return NAN; // circuito abierto o en corto

  float voltaje = lecturaAdc / 4095.0 * 3.3;
  float resistenciaNtc = NTC_R_SERIE * (3.3 / voltaje - 1.0);
  float tempK = 1.0 / (1.0 / NTC_T0_K + log(resistenciaNtc / NTC_R0) / NTC_BETA);
  return tempK - 273.15;
}

void actualizarDistanciaDe10En10() {
  // SIMULACIÓN: onda triangular entre DIST_MIN_CM y DIST_MAX_CM.
  // Reemplazar por la lectura real del sensor ultrasónico cuando esté instalado.
  distanciaActualCm += direccionDistancia * 10.0;
  if (distanciaActualCm >= DIST_MAX_CM) {
    distanciaActualCm = DIST_MAX_CM;
    direccionDistancia = -1;
  } else if (distanciaActualCm <= DIST_MIN_CM) {
    distanciaActualCm = DIST_MIN_CM;
    direccionDistancia = 1;
  }
}

void actualizarLecturasSensores() {
  factorAcum = (DIST_MAX_CM - distanciaActualCm) / (DIST_MAX_CM - DIST_MIN_CM);
  factorAcum = constrain(factorAcum, 0.0, 1.0);

  tempC = leerTemperaturaNTC();

  // pH, turbidez y conductividad: derivados matemáticamente del nivel
  // simulado (y la temperatura real) hasta instalar los sensores reales.
  phVal = 7.5 - factorAcum * 1.8;
  turbVal = 5.0 + factorAcum * 95.0;
  float tempParaCond = isnan(tempC) ? 20.0 : tempC;
  condVal = 300.0 + factorAcum * 700.0 + (tempParaCond - 20.0) * 4.0;

  if (factorAcum >= 0.75) {
    estadoActual = "critico";
    alertaBuzzer = true;
  } else if (factorAcum >= 0.4) {
    estadoActual = "alerta";
    alertaBuzzer = false;
  } else {
    estadoActual = "normal";
    alertaBuzzer = false;
  }
}

void actualizarBuzzer() {
  if (alertaBuzzer) {
    tone(PIN_BUZZER, 2000);
  } else {
    noTone(PIN_BUZZER);
  }
}

void actualizarPantalla() {
  pantalla.clearDisplay();
  pantalla.setTextSize(1);
  pantalla.setTextColor(SSD1306_WHITE);
  pantalla.setCursor(0, 0);

  pantalla.println("Trampa Atoyac");
  pantalla.print("Nivel: ");
  pantalla.print(distanciaActualCm, 0);
  pantalla.println(" cm");
  pantalla.print("Estado: ");
  pantalla.println(estadoActual);
  pantalla.print("Temp: ");
  if (isnan(tempC)) {
    pantalla.println("--");
  } else {
    pantalla.print(tempC, 1);
    pantalla.println(" C");
  }
  pantalla.print("pH ");
  pantalla.print(phVal, 1);
  pantalla.print(" Turb ");
  pantalla.println(turbVal, 0);
  pantalla.print("WiFi: ");
  pantalla.println(WiFi.status() == WL_CONNECTED ? "conectado" : "sin conexion");

  pantalla.display();
}

void enviarLecturaASupabase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Sin WiFi, no se envía la lectura.");
    return;
  }

  // https:// en el ESP32 necesita un WiFiClientSecure explícito; con
  // HTTPClient a secas el handshake TLS falla siempre (POST nunca llega).
  // setInsecure() no valida el certificado del servidor — aceptable aquí
  // porque solo se manda la anon key pública, no hay credenciales secretas.
  WiFiClientSecure clienteSeguro;
  clienteSeguro.setInsecure();

  HTTPClient http;
  String url = String(SUPABASE_URL) + "/rest/v1/lecturas_sensores";
  if (!http.begin(clienteSeguro, url)) {
    Serial.println("No se pudo iniciar la conexión HTTPS a Supabase.");
    return;
  }
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  char tempStr[16];
  if (isnan(tempC)) {
    strcpy(tempStr, "null");
  } else {
    dtostrf(tempC, 0, 2, tempStr);
  }

  char cuerpo[400];
  snprintf(
    cuerpo, sizeof(cuerpo),
    "{\"dispositivo_id\":\"%s\",\"distancia_cm\":%.1f,\"nivel_factor\":%.3f,"
    "\"estado\":\"%s\",\"ph\":%.2f,\"turbidez_ntu\":%.1f,"
    "\"conductividad_us_cm\":%.1f,\"temperatura_c\":%s,\"alerta_buzzer\":%s}",
    DISPOSITIVO_ID, distanciaActualCm, factorAcum, estadoActual,
    phVal, turbVal, condVal, tempStr, alertaBuzzer ? "true" : "false"
  );

  int codigo = http.POST(cuerpo);
  Serial.print("POST lecturas_sensores -> HTTP ");
  Serial.println(codigo);
  if (codigo <= 0) {
    Serial.println(http.errorToString(codigo));
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  analogReadResolution(12);

  Wire.begin(PIN_SDA, PIN_SCL);
  if (!pantalla.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("No se encontró la pantalla OLED.");
  } else {
    pantalla.clearDisplay();
    pantalla.setTextSize(1);
    pantalla.setTextColor(SSD1306_WHITE);
    pantalla.setCursor(0, 0);
    pantalla.println("Iniciando...");
    pantalla.display();
  }

  conectarWifi();
  actualizarLecturasSensores();
}

void loop() {
  unsigned long ahoraMs = millis();

  // 1) Reconectar WiFi si se perdió la conexión.
  if (WiFi.status() != WL_CONNECTED) {
    conectarWifi();
  }

  // 2) Nivel de agua simulado (se reemplaza por el ultrasónico real).
  if (ahoraMs - ultimoCambioDistanciaMs >= INTERVALO_DISTANCIA_MS) {
    ultimoCambioDistanciaMs = ahoraMs;
    actualizarDistanciaDe10En10();
  }

  // 3) Lectura completa de sensores + pantalla + buzzer + envío a Supabase.
  if (ahoraMs - ultimoCambioSensoresMs >= INTERVALO_SENSORES_MS) {
    ultimoCambioSensoresMs = ahoraMs;
    actualizarLecturasSensores();
    actualizarBuzzer();
    actualizarPantalla();
    enviarLecturaASupabase();
  }
}
