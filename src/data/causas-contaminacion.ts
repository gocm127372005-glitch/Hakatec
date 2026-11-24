// Fuente principal: Saldaña Fabela, P. y Gómez Balandra, M.A. (Instituto Mexicano
// de Tecnología del Agua / UNAM), "Caracterización de fuentes puntuales de
// contaminación en el río Atoyac, México", XXX Congreso Interamericano de
// Ingeniería Sanitaria y Ambiental (AIDIS), 2006. Basado en el padrón REPDA de
// Puebla (CNA, 1999) y en muestreo de campo de 23 descargas industriales.
// PDF: https://agua.org.mx/wp-content/uploads/2020/03/Caracterizaci%C3%B3n-de-fuentes-puntuales-de-contaminaci%C3%B3n-en-el-r%C3%ADo-Atoyac-M%C3%A9xico.pdf
//
// Importante: los porcentajes por giro y los parámetros excedidos son del
// padrón de 1999 y el muestreo de 2006 — reflejan el patrón estructural de la
// subcuenca, no necesariamente qué empresas operan hoy. No se nombran empresas
// específicas aquí: el estudio sí las identifica, pero sería engañoso exhibir
// nombres de 1999 como acusación vigente sin una reverificación actual.

export type GiroIndustrial = {
  giro: string;
  porcentajeDescargas: number;
  contaminantesTipicos: string;
};

// Figura 2 del estudio: "Principales giros industriales en la cuenca del río Atoyac".
export const girosIndustriales: GiroIndustrial[] = [
  { giro: "Textil", porcentajeDescargas: 24, contaminantesTipicos: "DBO₅, sólidos, color (tintes)" },
  { giro: "Químico y petroquímico", porcentajeDescargas: 23, contaminantesTipicos: "Variable según proceso" },
  { giro: "Automotriz y autopartes", porcentajeDescargas: 17, contaminantesTipicos: "Metales, grasas y aceites" },
  { giro: "Papel", porcentajeDescargas: 10, contaminantesTipicos: "DBO₅, sólidos suspendidos" },
  { giro: "Alimenticio", porcentajeDescargas: 8, contaminantesTipicos: "DBO₅, nitrógeno y fósforo total" },
  { giro: "Otros", porcentajeDescargas: 8, contaminantesTipicos: "—" },
  { giro: "Metalmecánica", porcentajeDescargas: 6, contaminantesTipicos: "Plomo, cromo, zinc" },
  { giro: "Bebidas", porcentajeDescargas: 4, contaminantesTipicos: "DBO₅, sólidos" },
  { giro: "Construcción", porcentajeDescargas: 0, contaminantesTipicos: "—" },
];

export type CategoriaFuente = {
  categoria: string;
  descripcion: string;
  evidencia: string;
};

export const categoriasFuente: CategoriaFuente[] = [
  {
    categoria: "Industrial puntual",
    descripcion:
      "La principal causa documentada. De 23 descargas industriales muestreadas, 18 (78%) incumplían la NOM-001-SEMARNAT-1996 y 17 (74% de ellas tóxicas en bioensayo Vibrio fischeri).",
    evidencia: "168 de 522 descargas registradas en Puebla son industriales.",
  },
  {
    categoria: "Municipal / doméstica",
    descripcion:
      "Aguas residuales de drenaje sin tratar o sin conexión a red — aporta carga orgánica (DBO₅, coliformes) pero el estudio no desglosa su severidad relativa a la industrial.",
    evidencia: "132 de 522 descargas registradas en Puebla son municipales.",
  },
  {
    categoria: "Agropecuaria",
    descripcion:
      "No se documenta como fuente puntual relevante en este estudio — no se incluye aquí porque no hay evidencia que lo respalde, no porque se haya descartado.",
    evidencia: "Sin datos en esta fuente.",
  },
];

// Texto casi literal de las conclusiones del estudio (parámetros excedidos, en orden
// de frecuencia) — evitamos la tabla 6 detallada por giro porque la extracción del
// PDF no preserva con certeza qué celdas quedaron vacías por columna.
export const parametrosExcedidosOrden = [
  "Demanda Bioquímica de Oxígeno (DBO₅)",
  "Sólidos suspendidos totales",
  "Nitrógeno total",
  "Sólidos sedimentables",
  "Plomo",
  "Cromo",
  "Fósforo total",
  "Cadmio",
  "Zinc",
];

export const fuentesCitadas = [
  {
    titulo:
      "Caracterización de fuentes puntuales de contaminación en el río Atoyac, México (IMTA/UNAM, AIDIS 2006)",
    url: "https://agua.org.mx/wp-content/uploads/2020/03/Caracterizaci%C3%B3n-de-fuentes-puntuales-de-contaminaci%C3%B3n-en-el-r%C3%ADo-Atoyac-M%C3%A9xico.pdf",
    nota: "Fuente principal de los datos por giro industrial y parámetros excedidos (padrón 1999, muestreo 2006).",
  },
  {
    titulo: "RESA Atoyac — Conahcyt (Región de Emergencia Sanitaria y Ambiental)",
    url: "https://toxicologia.conahcyt.mx/resa-atoyac/",
    nota: "Reconocimiento federal vigente de la cuenca como región de emergencia por daños a la salud.",
  },
  {
    titulo: "Descargas irregulares en el Río Atoyac aumentaron 160% en 2025, según Conagua",
    url: "https://urbanotlaxcala.mx/sociedad/medio-ambiente/descargas-irregulares-en-el-rio-atoyac-aumentaron-un-160-en-2025-segun-conagua-se-tienen-identificadas-mil-95/",
    nota: "Cifra de prensa citando a CONAGUA (2025) — no verificada contra el boletín oficial, se cita como referencia periodística.",
  },
];
