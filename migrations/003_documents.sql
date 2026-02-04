-- Create documents table for rental contract storage
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'rental_contract',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, partially_signed, signed

  -- Party emails for querying documents by user
  owner_email TEXT,
  renter_email TEXT,

  -- Party personal numbers (Moldovan IDNP) for contract identification
  owner_personal_number VARCHAR(13),
  renter_personal_number VARCHAR(13),

  -- Storage paths in Supabase storage
  unsigned_path TEXT,
  partially_signed_path TEXT,
  signed_path TEXT,

  -- Signatures stored as JSONB
  -- Structure: { data: base64, signedAt: timestamp, method: 'draw'|'type'|'upload'|'camera', signerName: string, signerEmail: string }
  owner_signature JSONB,
  renter_signature JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by order_id
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON documents(order_id);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Indexes for email lookups
CREATE INDEX IF NOT EXISTS idx_documents_owner_email ON documents(owner_email);
CREATE INDEX IF NOT EXISTS idx_documents_renter_email ON documents(renter_email);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies for documents table (anon + authenticated since users auth via Magento, not Supabase)
CREATE POLICY "Allow view documents" ON documents
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert documents" ON documents
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update documents" ON documents
  FOR UPDATE TO anon, authenticated
  USING (true);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket (anon + authenticated)
CREATE POLICY "Allow uploads to documents"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow reads from documents"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Allow updates to documents"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id = 'documents');

COMMENT ON TABLE documents IS 'Stores rental contract documents and their signatures';
COMMENT ON COLUMN documents.order_id IS 'Reference to the Magento order number';
COMMENT ON COLUMN documents.type IS 'Document type (currently only rental_contract)';
COMMENT ON COLUMN documents.status IS 'Signing status: pending, partially_signed, or signed';
COMMENT ON COLUMN documents.unsigned_path IS 'Supabase storage path for unsigned contract';
COMMENT ON COLUMN documents.partially_signed_path IS 'Supabase storage path for partially signed contract (renter signed)';
COMMENT ON COLUMN documents.signed_path IS 'Supabase storage path for fully signed contract';
COMMENT ON COLUMN documents.owner_signature IS 'Owner signature data as JSONB';
COMMENT ON COLUMN documents.renter_signature IS 'Renter signature data as JSONB';
COMMENT ON COLUMN documents.owner_email IS 'Owner email for document lookups';
COMMENT ON COLUMN documents.renter_email IS 'Renter email for document lookups';
COMMENT ON COLUMN documents.owner_personal_number IS 'Moldovan IDNP (personal identification number) of the product owner';
COMMENT ON COLUMN documents.renter_personal_number IS 'Moldovan IDNP (personal identification number) of the renter';
