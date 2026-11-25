-- 0001 restringía las políticas de reportes a "anon". Eso rompe el formulario
-- público en cuanto el mismo navegador también tiene abierta una sesión de
-- Supabase Auth (p. ej. un operador que inició sesión en el dashboard):
-- la petición ya no corre como "anon" sino como "authenticated", y la
-- política no la cubre -> 42501 "row-level security policy violation".
-- Se amplían a "public" (cualquier rol, con o sin sesión) ya que esta tabla
-- no guarda datos personales sensibles.

drop policy if exists "insertar_reporte_publico" on reportes;
create policy "insertar_reporte_publico"
  on reportes for insert
  to public
  with check (true);

drop policy if exists "leer_reportes_publico" on reportes;
create policy "leer_reportes_publico"
  on reportes for select
  to public
  using (true);

grant select, insert on public.reportes to authenticated;

-- El panel de incidentes (gestión pública) necesita poder marcar un reporte
-- como asignado/atendido y registrar kg retirados + institución que lo atendió.
create policy "actualizar_reporte_dashboard"
  on reportes for update
  to public
  using (true)
  with check (true);

grant update on public.reportes to anon, authenticated;
