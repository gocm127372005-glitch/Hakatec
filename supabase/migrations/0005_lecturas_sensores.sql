-- Telemetría de la trampa ESP32 (nivel de agua + calidad del agua simulada
-- a partir del nivel, + temperatura real del NTC). Sin datos personales, así
-- que se sigue el mismo patrón que "reportes": RLS abierto a "public" tanto
-- para insertar (el propio ESP32, con la clave anon/publishable) como para
-- leer (el dashboard).

create table if not exists lecturas_sensores (
  id uuid primary key default gen_random_uuid(),
  dispositivo_id text not null default 'trampa-01',
  distancia_cm numeric,
  nivel_factor numeric,
  estado text,
  ph numeric,
  turbidez_ntu numeric,
  conductividad_us_cm numeric,
  temperatura_c numeric,
  alerta_buzzer boolean not null default false,
  creado_en timestamptz not null default now()
);

comment on table lecturas_sensores is 'Telemetría periódica de la trampa ESP32: nivel de agua (ultrasónico) y calidad del agua (simulada a partir del nivel hasta tener sensores reales), más temperatura real del NTC.';
comment on column lecturas_sensores.nivel_factor is 'Factor de acumulación 0..1 derivado de la distancia (0 = nivel bajo, 1 = acumulación alta).';
comment on column lecturas_sensores.ph is 'pH simulado a partir del nivel de agua, hasta contar con sensor de pH real.';
comment on column lecturas_sensores.turbidez_ntu is 'Turbidez simulada a partir del nivel de agua, hasta contar con sensor de turbidez real.';
comment on column lecturas_sensores.conductividad_us_cm is 'Conductividad simulada a partir del nivel de agua y la temperatura real, hasta contar con sensor de conductividad real.';
comment on column lecturas_sensores.temperatura_c is 'Temperatura real medida por el NTC (KY-013) en IO34; NULL si la lectura del ADC no fue válida.';

alter table lecturas_sensores enable row level security;

create policy "insertar_lectura_publico"
  on lecturas_sensores for insert
  to public
  with check (true);

create policy "leer_lecturas_publico"
  on lecturas_sensores for select
  to public
  using (true);

-- Índice para "última lectura por dispositivo" / series de tiempo recientes.
create index if not exists lecturas_sensores_dispositivo_creado_idx
  on lecturas_sensores (dispositivo_id, creado_en desc);
