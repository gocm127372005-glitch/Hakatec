-- Soporte para el flujo de notificaciones automáticas por WhatsApp:
-- 1) Un mensaje de cierre con el folio ~15 min después de recibido el reporte
--    (para reportes que llegaron por WhatsApp).
-- 2) Un aviso cuando el reporte pasa a "en revisión" (asignado) o "atendido",
--    enviado por un workflow programado en n8n dentro de ~1 hora del cambio.
--
-- Ambos se controlan con columnas simples para no reenviar el mismo aviso
-- dos veces; el workflow de n8n las marca después de enviar cada mensaje.

alter table reportes
  add column if not exists notificado_cierre boolean not null default false;

alter table reportes
  add column if not exists ultimo_estado_notificado text;

comment on column reportes.notificado_cierre is
  'true una vez que se envió el mensaje de cierre (folio) ~15 min después de creado_en, solo aplica a fuente=whatsapp.';
comment on column reportes.ultimo_estado_notificado is
  'último estado (asignado/atendido) por el que ya se avisó al ciudadano por WhatsApp; evita reenviar el mismo aviso.';
