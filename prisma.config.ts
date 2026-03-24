import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_TURSO_DATABASE_URL
      ?? process.env.DATABASE_URL
      ?? `file:${require('path').join(process.cwd(), 'prisma', 'dev.db')}`,
  },
})
