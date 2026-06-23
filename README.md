# Afto Storefront Platform

A single-tenant e-commerce storefront with a **JSON-backed config** (POC) and a **split-pane Studio** for merchants to edit their website live — preview on the left, controls on the right.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  One deployment per customer (Azure App Service, etc.)       │
├─────────────────────────────────────────────────────────────┤
│  .env          → STORE_SLUG only (which store to load)       │
│  data/stores/  → Full website config (JSON → DB later)       │
│  /             → Public storefront                           │
│  /studio       → Merchant editor (preview + controls)        │
└─────────────────────────────────────────────────────────────┘
```

**Env does NOT hold website config** — only deployment identity and secrets.  
All store data (theme, products, homepage blocks) lives in `data/stores/{slug}.json`.

## Quick Start

```bash
nvm use 20
npm install
cp .env.example .env
npm run dev
```

Visit:
- **Storefront:** http://localhost:3000
- **Studio:** http://localhost:3000/studio
- **Login:** `manohar@getafto.com` / `manohar@getafto.com`

## Switch Customer (Local Dev)

Change `STORE_SLUG` in `.env`:

```env
STORE_SLUG=namastesupermarket   # default
STORE_SLUG=sbm                  # SBM Retail demo
```

Available stores in `data/stores/`:
- `namastesupermarket.json` — Namaste Supermarket (teal theme)
- `sbm.json` — SBM Retail (red theme)

Restart dev server after changing `STORE_SLUG`.

## Studio Features

| Panel | Controls |
|-------|----------|
| **Theme** | Store name, primary/secondary colors, logo URL |
| **Homepage** | Edit hero, reorder/remove blocks, section titles |
| **Products** | Add, edit, remove products |
| **Categories** | Add, edit, remove categories |

Click **Save Changes** to persist to JSON and refresh the live preview.

## Project Structure

```
data/stores/           # Store config JSON (POC database)
src/
├── app/
│   ├── (storefront)/  # Public website
│   ├── studio/        # Merchant studio + login
│   └── api/           # Store CRUD + auth
├── components/        # Storefront blocks + studio panels
├── lib/
│   ├── types/store.ts # JSON schema (matches future DB)
│   ├── store.ts       # Load/save JSON
│   └── auth.ts        # Studio session auth
└── middleware.ts      # Protect /studio routes
```

## JSON Schema

Each store file contains:

```json
{
  "store": { "name", "slug", "primaryColor", "secondaryColor", "logo" },
  "users": [{ "email", "password", "name" }],
  "categories": [{ "id", "name", "image" }],
  "products": [{ "id", "name", "price", "image", "description" }],
  "pages": [{ "slug", "title", "layout": [/* blocks */] }]
}
```

This schema is designed to map directly to a future Postgres/Payload DB.

## Production Deployment (Azure)

Each customer gets:
1. Their own Azure App Service (or Container App)
2. `STORE_SLUG` set in App Settings (or baked-in single `store.json`)
3. Custom domain (e.g. `namastesupermarket.com`)
4. JSON replaced by managed DB when ready

```env
STORE_SLUG=namastesupermarket
STUDIO_SECRET=<strong-random-secret>
NEXT_PUBLIC_SITE_URL=https://namastesupermarket.com
```

## Migration Path

```
Phase 1 (now)   → JSON files + Studio
Phase 2         → Postgres table with same schema
Phase 3         → Studio writes to DB API instead of JSON
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |

## License

MIT
