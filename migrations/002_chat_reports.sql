-- Chat Reports Migration
-- Run this in Supabase SQL Editor or via Supabase CLI

-- =============================================
-- 1. Admin Email Configuration Table
-- =============================================
CREATE TABLE IF NOT EXISTS admin_email_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Chat Reports Table
-- =============================================
CREATE TABLE IF NOT EXISTS chat_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  reporter_email VARCHAR(255) NOT NULL,
  reporter_role VARCHAR(20) NOT NULL CHECK (reporter_role IN ('owner', 'receiver')),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_reports_conversation ON chat_reports(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_reports_status ON chat_reports(status);
CREATE INDEX IF NOT EXISTS idx_chat_reports_reporter ON chat_reports(reporter_email);

-- =============================================
-- 3. Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on tables
ALTER TABLE admin_email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_reports ENABLE ROW LEVEL SECURITY;

-- Admin email config: Allow all operations (server-side access only)
CREATE POLICY "Allow all admin_email_config operations" ON admin_email_config
  FOR ALL USING (true) WITH CHECK (true);

-- Chat reports: Allow all operations (server-side access only)
CREATE POLICY "Allow all chat_reports operations" ON chat_reports
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- 4. Insert Default Admin Email (update with your email)
-- =============================================
-- INSERT INTO admin_email_config (email, is_active) VALUES ('admin@yourdomain.com', true);
