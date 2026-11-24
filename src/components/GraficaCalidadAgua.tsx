"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Datos SIMULADOS — serie de ejemplo mientras no hay un ESP32 enviando
// lecturas reales de turbidez a Supabase. No son mediciones.
const datosSimulados = [
  { hora: "00:00", turbidez: 14 },
  { hora: "04:00", turbidez: 12 },
  { hora: "08:00", turbidez: 19 },
  { hora: "12:00", turbidez: 26 },
  { hora: "16:00", turbidez: 21 },
  { hora: "20:00", turbidez: 16 },
  { hora: "23:59", turbidez: 13 },
];

export function GraficaCalidadAgua() {
  return (
    <ResponsiveContainer width="100%" height={110}>
      <AreaChart data={datosSimulados} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="turbidezGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={26} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--ink)",
          }}
          labelStyle={{ color: "var(--muted)" }}
          formatter={(value) => [`${value} NTU (simulado)`, "Turbidez"]}
        />
        <Area
          type="monotone"
          dataKey="turbidez"
          stroke="#fbbf24"
          fill="url(#turbidezGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
