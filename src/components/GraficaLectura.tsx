"use client";

import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type PuntoLectura = { hora: string; valor: number | null };

export function GraficaLectura({
  titulo,
  unidad,
  color,
  datos,
}: {
  titulo: string;
  unidad: string;
  color: string;
  datos: PuntoLectura[];
}) {
  const gradientId = `grafica-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="rounded-lg border border-line bg-bg p-3">
      <p className="mb-1 text-sm font-medium text-ink">
        {titulo} <span className="font-normal text-muted">({unidad})</span>
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={datos} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--muted)" }}
            axisLine={false}
            tickLine={false}
            width={32}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--ink)",
            }}
            labelStyle={{ color: "var(--muted)" }}
            formatter={(value) => [`${value} ${unidad}`, titulo]}
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
