// Fuente: INEGI, "Cuenca hidrológica Alto Atoyac: Humedales, Informe técnico", 2019.
// Coordenadas aproximadas, leídas de los mapas georreferenciados del propio informe
// (grados/minutos de cada "Mapa de localización" por humedal) — no son coordenadas
// de levantamiento topográfico exacto, son suficientes para ubicar cada punto en un
// mapa de referencia. Datos fisicoquímicos: solo donde el informe reporta medición
// real "in situ" (Atlangatepec y Del Pueblo); el resto no se midió en el informe.

export type Humedal = {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  areaKm2: number;
  sistema: string;
  estado: string;
  municipios: string;
  sitioRamsar: boolean;
  lirioAcuaticoPorcentaje: number | null;
  agua: {
    pH: number;
    conductividad_mS_cm: number;
    solidosDisueltosTotales_mgL: number;
    oxigenoDisuelto_mgL: number;
  } | null;
  fuente: string;
};

export const humedalesAltoAtoyac: Humedal[] = [
  {
    id: "manuel-avila-camacho",
    nombre: "Presa Manuel Ávila Camacho (Valsequillo)",
    lat: 18.92,
    lng: -98.17,
    areaKm2: 33.85,
    sistema: "Creado / Estanque artificial",
    estado: "Puebla",
    municipios: "Puebla y Tzicatlacoyan",
    sitioRamsar: true,
    lirioAcuaticoPorcentaje: 50,
    agua: null,
    fuente: "INEGI, 2019, pp. 23-26",
  },
  {
    id: "atlangatepec",
    nombre: "Presa de Atlangatepec",
    lat: 19.558,
    lng: -98.175,
    areaKm2: 12.32,
    sistema: "Creado / Estanque artificial",
    estado: "Tlaxcala",
    municipios: "Atlangatepec y Tlaxco",
    sitioRamsar: true,
    lirioAcuaticoPorcentaje: null,
    agua: {
      pH: 8.55,
      conductividad_mS_cm: 0.355,
      solidosDisueltosTotales_mgL: 177.0,
      oxigenoDisuelto_mgL: 5.04,
    },
    fuente: "INEGI, 2019, p. 32",
  },
  {
    id: "acuitlapilco",
    nombre: "Acuitlapilco",
    lat: 19.279,
    lng: -98.225,
    areaKm2: 1.12,
    sistema: "Lacustre / Lago",
    estado: "Tlaxcala",
    municipios: "Tlaxcala, Tepeyanco y Santa Isabel Xiloxoxtla",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 37",
  },
  {
    id: "nd-lazaro-cardenas",
    nombre: "N/D (humedal sin nombre)",
    lat: 19.521,
    lng: -98.008,
    areaKm2: 0.68,
    sistema: "Palustre / Llanura inundada",
    estado: "Tlaxcala",
    municipios: "Lázaro Cárdenas",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 43",
  },
  {
    id: "jalnene",
    nombre: "Jalnene",
    lat: 19.542,
    lng: -98.183,
    areaKm2: 0.61,
    sistema: "Lacustre / Lago",
    estado: "Tlaxcala",
    municipios: "Atlangatepec",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 48",
  },
  {
    id: "parque-ecologico-revolucion-mexicana",
    nombre: "Parque Ecológico Revolución Mexicana",
    lat: 19.029,
    lng: -98.188,
    areaKm2: 0.58,
    sistema: "Creado / Estanque artificial",
    estado: "Puebla",
    municipios: "Puebla",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 53",
  },
  {
    id: "san-antonio-chautla",
    nombre: "San Antonio Chautla",
    lat: 19.3125,
    lng: -98.4708,
    areaKm2: 0.45,
    sistema: "Creado / Estanque artificial",
    estado: "Puebla",
    municipios: "San Salvador El Verde",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 58",
  },
  {
    id: "el-sol",
    nombre: "El Sol",
    lat: 19.433,
    lng: -98.325,
    areaKm2: 0.42,
    sistema: "Creado / Estanque artificial",
    estado: "Tlaxcala",
    municipios: "Hueyotlipan",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: 90,
    agua: null,
    fuente: "INEGI, 2019, p. 63",
  },
  {
    id: "san-baltazar",
    nombre: "San Baltazar",
    lat: 19.0056,
    lng: -98.2111,
    areaKm2: 0.15,
    sistema: "Creado / Estanque artificial",
    estado: "Puebla",
    municipios: "San Baltazar",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: null,
    agua: null,
    fuente: "INEGI, 2019, p. 67",
  },
  {
    id: "del-pueblo",
    nombre: "Del Pueblo",
    lat: 19.467,
    lng: -98.283,
    areaKm2: 0.05,
    sistema: "Creado / Estanque artificial",
    estado: "Tlaxcala",
    municipios: "Xaltocan",
    sitioRamsar: false,
    lirioAcuaticoPorcentaje: 20,
    agua: {
      pH: 7.65,
      conductividad_mS_cm: 0.12,
      solidosDisueltosTotales_mgL: 60.0,
      oxigenoDisuelto_mgL: 2.68,
    },
    fuente: "INEGI, 2019, p. 72",
  },
];
