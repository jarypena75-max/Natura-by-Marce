# Natura by Marce (Next.js + Prisma + Tailwind)

Catálogo tipo tienda (sin checkout) + Centro de Inventario (admin) con movimientos.

## Requisitos
- Node.js 18+ (recomendado 20+)

## Configuración local
1) Copia variables:
```bash
cp .env.example .env
```

2) Instala dependencias:
```bash
npm install
```

3) Crea la base y aplica migraciones:
```bash
npx prisma migrate dev --name init
```

4) Carga datos de ejemplo (opcional):
```bash
npm run prisma:seed
```

5) Inicia:
```bash
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Deploy a Vercel
1) Sube a GitHub
2) Importa repo en Vercel
3) En Vercel -> Project Settings -> Environment Variables:
   - DATABASE_URL (si usas Postgres en producción)
   - WHATSAPP_PHONE
   - ADMIN_PASSWORD
   - AUTH_SECRET

### Nota de BD en producción
SQLite funciona bien local. En Vercel (serverless) es mejor Postgres (Supabase/Neon).
Si cambias a Postgres, actualiza `prisma/schema.prisma` datasource provider y tu DATABASE_URL.

## Endpoints
- Público:
  - GET /api/products (q, category, inStock=1)
- Admin (requiere login):
  - GET/POST /api/admin/products
  - PATCH/DELETE /api/admin/products/:id
  - GET/POST /api/movements
