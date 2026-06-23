-- websites-cms schema (run once per database)

CREATE TABLE IF NOT EXISTS businesses (
  id          UUID PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS component_definitions (
  id                  UUID PRIMARY KEY,
  type                TEXT NOT NULL,
  variant             TEXT NOT NULL,
  label               TEXT NOT NULL,
  category            TEXT NOT NULL CHECK (category IN ('page', 'section', 'component')),
  description         TEXT,
  preview_color       TEXT,
  default_props       JSONB NOT NULL DEFAULT '{}',
  field_schema        JSONB NOT NULL DEFAULT '[]',
  allowed_child_types TEXT[] NOT NULL DEFAULT '{}',
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type, variant)
);

CREATE INDEX IF NOT EXISTS idx_component_definitions_type ON component_definitions (type);
CREATE INDEX IF NOT EXISTS idx_component_definitions_active ON component_definitions (is_active);

CREATE TABLE IF NOT EXISTS website_configs (
  business_id       UUID PRIMARY KEY REFERENCES businesses (id) ON DELETE CASCADE,
  published_config    JSONB NOT NULL,
  draft_config        JSONB,
  version             INTEGER NOT NULL DEFAULT 1,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_configs_updated ON website_configs (updated_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_businesses_updated ON businesses;
CREATE TRIGGER trg_businesses_updated
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_component_definitions_updated ON component_definitions;
CREATE TRIGGER trg_component_definitions_updated
  BEFORE UPDATE ON component_definitions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_website_configs_updated ON website_configs;
CREATE TRIGGER trg_website_configs_updated
  BEFORE UPDATE ON website_configs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
