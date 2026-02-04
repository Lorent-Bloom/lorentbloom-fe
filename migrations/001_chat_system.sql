-- Chat System Migration
-- Run this in Supabase SQL Editor or via Supabase CLI

-- =============================================
-- 1. Conversation Steps Table (configurable workflow)
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_steps (
  id SERIAL PRIMARY KEY,
  step_key TEXT UNIQUE NOT NULL,
  step_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  triggered_by TEXT NOT NULL CHECK (triggered_by IN ('owner', 'receiver', 'system')),
  required_action TEXT NOT NULL CHECK (required_action IN ('confirm', 'upload_images', 'both', 'none')),
  notify_party TEXT NOT NULL CHECK (notify_party IN ('owner', 'receiver', 'both')),
  next_step_id INTEGER REFERENCES conversation_steps(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Conversations Table
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  owner JSONB NOT NULL,        -- { id, email, name }
  receiver JSONB NOT NULL,     -- { id, email, name }
  current_step_id INTEGER REFERENCES conversation_steps(id),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups (by email since that's how we query)
CREATE INDEX IF NOT EXISTS idx_conversations_order ON conversations(order_id);
CREATE INDEX IF NOT EXISTS idx_conversations_owner_email ON conversations((owner->>'email'));
CREATE INDEX IF NOT EXISTS idx_conversations_receiver_email ON conversations((receiver->>'email'));

-- =============================================
-- 3. Conversation Messages Table
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('owner', 'receiver', 'system')),
  content TEXT,
  image_keys TEXT[],
  is_system_message BOOLEAN DEFAULT FALSE,
  step_id INTEGER REFERENCES conversation_steps(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster message retrieval
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created ON conversation_messages(conversation_id, created_at);

-- =============================================
-- 4. Conversation Progress Table
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  step_id INTEGER NOT NULL REFERENCES conversation_steps(id),
  completed_by INTEGER NOT NULL,  -- customer_id as number
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  image_keys TEXT[],
  UNIQUE(conversation_id, step_id)
);

-- =============================================
-- 5. Conversation Message Reads Table (for unread tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- =============================================
-- 6. Insert Default Conversation Steps
-- =============================================
INSERT INTO conversation_steps (id, step_key, step_order, name, description, triggered_by, required_action, notify_party, next_step_id) VALUES
  (1, 'order_created', 1, 'Order Created', 'The rental order has been placed and confirmed.', 'system', 'none', 'both', 2),
  (2, 'photos_sent', 2, 'Photos Sent', 'The owner sends photos of the product before shipping.', 'owner', 'upload_images', 'receiver', 3),
  (3, 'money_sent', 3, 'Money Sent', 'Payment has been sent by the renter.', 'receiver', 'upload_images', 'owner', 4),
  (4, 'money_received', 4, 'Money Received', 'Payment has been received by the owner.', 'owner', 'confirm', 'receiver', 5),
  (5, 'package_sent', 5, 'Package Sent', 'The rental item has been shipped.', 'owner', 'confirm', 'receiver', 6),
  (6, 'package_received', 6, 'Package Received', 'The rental item has been received by the renter.', 'receiver', 'confirm', 'owner', 7),
  (7, 'package_sent_back', 7, 'Package Sent Back', 'The rental item has been returned by the renter.', 'receiver', 'upload_images', 'owner', 8),
  (8, 'package_received_back', 8, 'Package Received Back', 'The rental item has been received back by the owner.', 'owner', 'confirm', 'receiver', NULL)
ON CONFLICT (step_key) DO NOTHING;

-- =============================================
-- 7. Enable Realtime for messages table
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_messages;

-- =============================================
-- 8. Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_steps ENABLE ROW LEVEL SECURITY;

-- Conversation steps are public (read-only)
CREATE POLICY "Conversation steps are viewable by everyone" ON conversation_steps
  FOR SELECT USING (true);

-- Allow all operations for now (tighten later with proper auth)
CREATE POLICY "Allow all conversation operations" ON conversations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all message operations" ON conversation_messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all progress operations" ON conversation_progress
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all message_reads operations" ON conversation_message_reads
  FOR ALL USING (true) WITH CHECK (true);
