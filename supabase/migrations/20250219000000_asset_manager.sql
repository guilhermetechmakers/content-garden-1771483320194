-- asset_manager table for Asset Manager feature
-- Manages uploaded images, videos, and attachments with provenance links to Seeds and Canvases.

CREATE TABLE IF NOT EXISTS asset_manager (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE asset_manager ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "asset_manager_read_own" ON asset_manager
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "asset_manager_insert_own" ON asset_manager
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "asset_manager_update_own" ON asset_manager
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "asset_manager_delete_own" ON asset_manager
  FOR DELETE USING (auth.uid() = user_id);

-- Optional: updated_at trigger
CREATE OR REPLACE FUNCTION set_asset_manager_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS asset_manager_updated_at ON asset_manager;
CREATE TRIGGER asset_manager_updated_at
  BEFORE UPDATE ON asset_manager
  FOR EACH ROW
  EXECUTE PROCEDURE set_asset_manager_updated_at();
