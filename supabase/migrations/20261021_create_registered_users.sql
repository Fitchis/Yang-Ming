-- Yang Ming Marine Transport Corp - Schema Migration
-- Table: yangming_registered_users

CREATE TABLE IF NOT EXISTS public.yangming_registered_users (
  id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size VARCHAR(50),
  file_data_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'Verified'
);

-- Enable Row Level Security (RLS) as required by Supabase best practices
ALTER TABLE public.yangming_registered_users ENABLE ROW LEVEL SECURITY;

-- Allow public inserts during registration
CREATE POLICY "Allow public registration insert"
  ON public.yangming_registered_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading registered users for admin operations
CREATE POLICY "Allow public select for registered users"
  ON public.yangming_registered_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed initial corporate partners if table is empty
INSERT INTO public.yangming_registered_users (id, company_name, email, file_name, file_type, file_size, created_at, status)
VALUES
  ('usr_ym_001', 'Evergreen Logistics Asia', 'ops@evergreen-asia.com', 'commercial_shipping_license_2026.pdf', 'application/pdf', '2.4 MB', NOW() - INTERVAL '3 days', 'Verified'),
  ('usr_ym_002', 'Pacific Rim Freight & Cargo', 'maritime@pacific-rim-cargo.com', 'vessel_charter_agreement.pdf', 'application/pdf', '1.8 MB', NOW() - INTERVAL '2 days', 'Verified'),
  ('usr_ym_003', 'Orient Harbor Transshipment Co.', 'contact@orient-harbor.tw', 'port_clearance_certificate.jpg', 'image/jpeg', '3.1 MB', NOW() - INTERVAL '1 day', 'Active')
ON CONFLICT (email) DO NOTHING;
