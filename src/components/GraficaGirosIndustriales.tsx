"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { girosIndustriales } from "@/data/causas-contaminacion";

const datos = [...girosIndustriales]
  .filter((g) => g.porcentajeDescargas > 0)
  .sort((a, b) => b.porcentajeDescargas - a.porcentajeDescargas);

export function GraficaGirosIndustriales() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
        <XAxis
          type="number"
          unit="%"
          tick={{ fontSize: 10, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="giro"
          width={140}
          tick={{ fontSize: 11, fill: "var(--ink)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "var(--accent)", fillOpacity: 0.08 }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--ink)",
          }}
          formatter={(value, _name, item) => [
            `${value}% de las descargas`,
            item.payload.contaminantesTipicos,
          ]}
        />
        <Bar dataKey="porcentajeDescargas" radius={[0, 6, 6, 0]}>
          {datos.map((d) => (
            <Cell
              key={d.giro}
              fill={d.giro === "Textil" ? "var(--accent)" : "var(--accent2)"}
              fillOpacity={d.giro === "Textil" ? 1 : 0.6}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
