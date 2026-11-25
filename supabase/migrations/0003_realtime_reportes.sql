-- Habilita Supabase Realtime (postgres_changes) para la tabla reportes, para
-- que la página pública de reportes ciudadanos pueda mostrar en vivo los
-- reportes que van llegando (web, WhatsApp, etc.) sin tener que recargar.
-- Realtime respeta las políticas RLS existentes (SELECT ya es público desde
-- 0001/0002), así que esto no expone nada nuevo, solo permite suscribirse a
-- los cambios que el cliente ya podría leer con un SELECT normal.

alter publication supabase_realtime add table reportes;
