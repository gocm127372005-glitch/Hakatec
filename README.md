# Hakatec

Dashboard de monitoreo ambiental para el HackaTec Nacional 2026 (reto SECIHTI Puebla, cuenca del Alto Atoyac).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) como backend/base de datos en tiempo real

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa con tu URL y anon key de Supabase
npm run dev
```

## Pendiente

- Definir el esquema de datos en Supabase (lecturas de sensores, incidentes, estaciones).
- Conectar el dashboard a datos reales una vez definido ese esquema.
- Integrar el envío de datos desde el ESP32 (HTTP REST) y, si aplica, el flujo de n8n.
