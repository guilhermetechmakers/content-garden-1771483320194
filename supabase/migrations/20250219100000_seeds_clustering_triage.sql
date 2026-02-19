-- Seeds table (Seed capture & storage model)
CREATE TABLE IF NOT EXISTS seeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'thought' CHECK (type IN ('link', 'voice', 'screenshot', 'thought')),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  extracted_bullets TEXT[] DEFAULT '{}',
  source_url TEXT,
  attachments TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ignored', 'merged')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seeds_read_own" ON seeds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "seeds_insert_own" ON seeds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "seeds_update_own" ON seeds FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "seeds_delete_own" ON seeds FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION set_seeds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS seeds_updated_at ON seeds;
CREATE TRIGGER seeds_updated_at
  BEFORE UPDATE ON seeds
  FOR EACH ROW
  EXECUTE PROCEDURE set_seeds_updated_at();

-- Soft clusters (topic labels); clustering job or Edge Function populates
CREATE TABLE IF NOT EXISTS seed_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seed_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_clusters_read_own" ON seed_clusters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "seed_clusters_insert_own" ON seed_clusters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "seed_clusters_update_own" ON seed_clusters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "seed_clusters_delete_own" ON seed_clusters FOR DELETE USING (auth.uid() = user_id);

-- Assignment of seeds to clusters (soft: one seed can be in one cluster for display)
CREATE TABLE IF NOT EXISTS seed_cluster_assignments (
  seed_id UUID REFERENCES seeds(id) ON DELETE CASCADE,
  cluster_id UUID REFERENCES seed_clusters(id) ON DELETE CASCADE,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (seed_id, cluster_id)
);

ALTER TABLE seed_cluster_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_cluster_assignments_read_via_seeds"
  ON seed_cluster_assignments FOR SELECT
  USING (EXISTS (SELECT 1 FROM seeds s WHERE s.id = seed_id AND s.user_id = auth.uid()));

CREATE POLICY "seed_cluster_assignments_insert_via_seeds"
  ON seed_cluster_assignments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM seeds s WHERE s.id = seed_id AND s.user_id = auth.uid()));

CREATE POLICY "seed_cluster_assignments_delete_via_seeds"
  ON seed_cluster_assignments FOR DELETE
  USING (EXISTS (SELECT 1 FROM seeds s WHERE s.id = seed_id AND s.user_id = auth.uid()));

-- Triage actions (Keep / Merge / Ignore) for audit
CREATE TABLE IF NOT EXISTS seed_triage_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seed_id UUID REFERENCES seeds(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('keep', 'merge', 'ignore')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seed_triage_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_triage_actions_read_own" ON seed_triage_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "seed_triage_actions_insert_own" ON seed_triage_actions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Merge provenance (which seeds were merged into a new seed)
CREATE TABLE IF NOT EXISTS seed_merge_provenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merged_seed_id UUID REFERENCES seeds(id) ON DELETE CASCADE,
  source_seed_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seed_merge_provenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_merge_provenance_read_via_seeds"
  ON seed_merge_provenance FOR SELECT
  USING (EXISTS (SELECT 1 FROM seeds s WHERE s.id = merged_seed_id AND s.user_id = auth.uid()));

CREATE POLICY "seed_merge_provenance_insert_via_seeds"
  ON seed_merge_provenance FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM seeds s WHERE s.id = merged_seed_id AND s.user_id = auth.uid()));

-- Human feedback for cluster confidence (optional loop)
CREATE TABLE IF NOT EXISTS seed_confidence_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cluster_id UUID REFERENCES seed_clusters(id) ON DELETE CASCADE,
  seed_id UUID REFERENCES seeds(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('correct', 'incorrect')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seed_confidence_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seed_confidence_feedback_read_own" ON seed_confidence_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "seed_confidence_feedback_insert_own" ON seed_confidence_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for Garden feed and triage
CREATE INDEX IF NOT EXISTS idx_seeds_user_status_created ON seeds(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seed_cluster_assignments_cluster ON seed_cluster_assignments(cluster_id);
CREATE INDEX IF NOT EXISTS idx_seed_triage_actions_seed ON seed_triage_actions(seed_id);
