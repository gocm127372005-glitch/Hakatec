-- Reportes ciudadanos con folio de seguimiento.
-- Fuente de cada reporte: formulario web público o WhatsApp (vía n8n).
-- No se guardan datos personales sensibles del reportante (solo el número
-- de WhatsApp si vino por ese canal, necesario para poder responderle).

create sequence if not exists reportes_folio_seq;

create table if not exists reportes (
  id uuid primary key default gen_random_uuid(),
  folio text not null unique default (
    'ATY-' || lpad(nextval('reportes_folio_seq')::text, 6, '0')
  ),
  tipo text not null check (
    tipo in (
      'Basura acumulada en el río',
      'Descarga de aguas residuales',
      'Mal olor',
      'Lirio acuático / plantas invasoras',
      'Posible desbordamiento',
      'Otro'
    )
  ),
  descripcion text not null,
  ubicacion_texto text not null,
  lat double precision,
  lng double precision,
  fuente text not null default 'web' check (fuente in ('web', 'whatsapp', 'ficha_papel', 'sensor_esp32')),
  whatsapp_numero text,
  estado text not null default 'recibido' check (estado in ('borrador', 'recibido', 'asignado', 'atendido')),
  institucion_escalada text,
  foto_url text,
  kg_retirados numeric,
  creado_en timestamptz not null default now(),
  atendido_en timestamptz
);

alter sequence reportes_folio_seq owned by reportes.folio;

comment on table reportes is 'Reportes ciudadanos y alertas automáticas del ESP32, con folio de seguimiento.';
comment on column reportes.fuente is 'web = formulario público; whatsapp = vía n8n; ficha_papel = capturado a mano; sensor_esp32 = alerta automática del dispositivo.';

-- RLS: el formulario público usa la clave anon (sin sesión de usuario).
alter table reportes enable row level security;

-- Cualquiera puede crear un reporte (formulario público / webhook de n8n).
create policy "insertar_reporte_publico"
  on reportes for insert
  to anon
  with check (true);

-- SELECT público: el formulario necesita leer el folio recién insertado
-- (insert().select()), y no se guardan datos personales sensibles en esta
-- tabla, así que exponer SELECT a anon es aceptable.
create policy "leer_reportes_publico"
  on reportes for select
  to anon
  using (true);

grant select on public.reportes to anon;

-- Consultar un reporte por su folio exacto, sin exponer el resto de la tabla.
create or replace function obtener_reporte_por_folio(folio_buscado text)
returns table (
  folio text,
  tipo text,
  estado text,
  institucion_escalada text,
  kg_retirados numeric,
  creado_en timestamptz,
  atendido_en timestamptz
)
language sql
security definer
set search_path = public
as $$
  select r.folio, r.tipo, r.estado, r.institucion_escalada, r.kg_retirados, r.creado_en, r.atendido_en
  from reportes r
  where r.folio = folio_buscado;
$$;

grant execute on function obtener_reporte_por_folio(text) to anon;
