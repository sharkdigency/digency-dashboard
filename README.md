# Digency Control Center ⚡☀️

Dashboard de monitorización en tiempo real para los agentes de IA de Digency: **Hermes** y **Apolo**.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** para estilos
- **Prisma** ORM + SQLite (dev) / Vercel Postgres (prod)
- Auto-refresh cada 30 segundos

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear base de datos
npx prisma db push

# 3. (Opcional) Seed con datos de prueba
npx prisma studio

# 4. Arrancar servidor de desarrollo
npm run dev
```

El dashboard estará en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.example` a `.env.local` y configura:

```env
DASHBOARD_API_KEY=tu-clave-secreta
```

## API

Todas las rutas requieren el header `x-api-key` con el valor de `DASHBOARD_API_KEY`.

### Tareas

```bash
# Listar todas
GET /api/tasks

# Crear tarea
POST /api/tasks
{"agent": "hermes", "title": "Nueva tarea", "priority": "high"}

# Actualizar tarea
PATCH /api/tasks/:id
{"status": "done"}
```

### Logs

```bash
# Últimos 50 logs
GET /api/logs

# Crear log
POST /api/logs
{"agent": "apolo", "message": "Tarea completada", "type": "success"}
```

### Heartbeat

```bash
# Registrar actividad de agente
POST /api/heartbeat
{"agent": "hermes"}
```

## Tipos disponibles

- **Task status:** `pending` | `in_progress` | `done` | `review`
- **Task priority:** `low` | `normal` | `high` | `urgent`
- **Log type:** `info` | `success` | `warning` | `error`

## Deploy en Vercel

### 1. Crea el proyecto en Vercel

```bash
npx vercel
```

### 2. Añade Vercel Postgres

En el dashboard de Vercel → Storage → Create Database → Postgres.

Una vez creada, conecta al proyecto. Vercel inyectará automáticamente:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 3. Actualiza el schema de Prisma para producción

En `prisma/schema.prisma`, cambia el datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

O usa un schema condicional con `prisma/schema.dev.prisma` (SQLite) y `prisma/schema.prod.prisma` (Postgres).

### 4. Variables de entorno en Vercel

En Vercel → Settings → Environment Variables:
```
DASHBOARD_API_KEY=tu-clave-secreta-produccion
```

### 5. Deploy

```bash
npx vercel --prod
```

Prisma ejecutará `prisma migrate deploy` automáticamente si configuras el build command:

```
prisma generate && prisma migrate deploy && next build
```

## Uso desde agentes

Los agentes (Hermes, Apolo) pueden reportar su actividad via API:

```python
import httpx

DASHBOARD_URL = "https://tu-dashboard.vercel.app"
API_KEY = "tu-clave"
HEADERS = {"x-api-key": API_KEY, "Content-Type": "application/json"}

# Heartbeat (cada 5 min)
httpx.post(f"{DASHBOARD_URL}/api/heartbeat", 
           json={"agent": "hermes"}, headers=HEADERS)

# Crear tarea
httpx.post(f"{DASHBOARD_URL}/api/tasks",
           json={"agent": "hermes", "title": "Analizar keywords cliente X", 
                 "client": "acme-corp", "priority": "high"},
           headers=HEADERS)

# Actualizar tarea a done
httpx.patch(f"{DASHBOARD_URL}/api/tasks/{task_id}",
            json={"status": "done"}, headers=HEADERS)

# Log de éxito
httpx.post(f"{DASHBOARD_URL}/api/logs",
           json={"agent": "hermes", "message": "Informe generado", "type": "success"},
           headers=HEADERS)
```

## Estructura del proyecto

```
digency-dashboard/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts        # GET/POST tasks
│   │   │   │   └── [id]/route.ts   # PATCH/DELETE task
│   │   │   ├── logs/
│   │   │   │   └── route.ts        # GET/POST logs
│   │   │   └── heartbeat/
│   │   │       └── route.ts        # POST heartbeat
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Dashboard principal
│   ├── components/
│   │   ├── AgentPanel.tsx
│   │   ├── DashboardClient.tsx
│   │   ├── LogItem.tsx
│   │   └── TaskCard.tsx
│   └── lib/
│       ├── auth.ts
│       └── prisma.ts
└── .env.local
```
