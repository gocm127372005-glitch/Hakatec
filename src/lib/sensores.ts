export const ESTADOS_LECTURA = ["normal", "alerta", "critico"] as const;

export type EstadoLectura = (typeof ESTADOS_LECTURA)[number];

export const ETIQUETA_ESTADO_LECTURA: Record<EstadoLectura, string> = {
  normal: "Normal",
  alerta: "Alerta",
  critico: "Crítico",
};

export const COLOR_ESTADO_LECTURA: Record<EstadoLectura, string> = {
  normal: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  alerta: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  critico: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300",
};

export type LecturaSensor = {
  id: string;
  dispositivo_id: string;
  distancia_cm: number | null;
  nivel_factor: number | null;
  estado: string | null;
  ph: number | null;
  turbidez_ntu: number | null;
  conductividad_us_cm: number | null;
  temperatura_c: number | null;
  alerta_buzzer: boolean;
  creado_en: string;
};

export const COLUMNAS_LECTURA_SENSOR =
  "id, dispositivo_id, distancia_cm, nivel_factor, estado, ph, turbidez_ntu, conductividad_us_cm, temperatura_c, alerta_buzzer, creado_en";

const MINUTOS_SIN_RESPUESTA_OFFLINE = 10;

/** Un dispositivo se considera "en línea" si envió algo en los últimos
 * MINUTOS_SIN_RESPUESTA_OFFLINE minutos (el ESP32 envía cada ~4.5s). */
export function dispositivoEnLinea(ultimaLecturaIso: string): boolean {
  const minutos = (Date.now() - new Date(ultimaLecturaIso).getTime()) / 60000;
  return minutos <= MINUTOS_SIN_RESPUESTA_OFFLINE;
}
