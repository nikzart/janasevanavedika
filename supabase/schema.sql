-- B Ravi Janaseva Vedike - Database Schema
-- Run this in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Core Data
  scheme_type TEXT NOT NULL,  -- 'GL', 'GJ', 'YN', 'SH', 'AB'
  applicant_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  ward_no TEXT,  -- Optional, for future filtering

  -- Dynamic Data (Stores scheme-specific fields like Bescom ID, RC No)
  form_data JSONB NOT NULL,

  -- Status Tracking
  status TEXT DEFAULT 'pending',  -- 'pending', 'reviewing', 'verified', 'processed', 'rejected'
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by TEXT,

  -- WhatsApp Sync Check
  is_whatsapp_clicked BOOLEAN DEFAULT false
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_scheme_type ON leads(scheme_type);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_mobile ON leads(mobile_number);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE (Anonymous) to INSERT (Submit form)
CREATE POLICY "Enable insert for everyone"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to READ
CREATE POLICY "Enable read for authenticated"
  ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to UPDATE
CREATE POLICY "Enable update for authenticated"
  ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to DELETE
CREATE POLICY "Enable delete for authenticated"
  ON leads
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Lead Documents Table (for uploaded documents)
-- ============================================

CREATE TABLE IF NOT EXISTS lead_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Document Info
  document_type TEXT NOT NULL,      -- 'aadhaar_wife', 'ration_card', 'bank_passbook', etc.
  document_name TEXT NOT NULL,      -- Display name (for dashboard)

  -- Image Data
  image_data TEXT NOT NULL,         -- Base64 encoded image
  file_size INTEGER,                -- Original file size in bytes
  compressed_size INTEGER,          -- Compressed size in bytes
  mime_type TEXT DEFAULT 'image/jpeg',

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_lead_documents_lead_id ON lead_documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_documents_type ON lead_documents(document_type);

-- Enable Row Level Security
ALTER TABLE lead_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE (Anonymous) to INSERT (Submit documents with form)
CREATE POLICY "Enable insert for everyone"
  ON lead_documents
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to READ
CREATE POLICY "Enable read for authenticated"
  ON lead_documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to DELETE
CREATE POLICY "Enable delete for authenticated"
  ON lead_documents
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Issues Table (for citizen issue reports)
-- ============================================

CREATE TABLE IF NOT EXISTS issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Reporter Info
  reporter_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,

  -- Issue Details
  category TEXT NOT NULL,          -- 'road', 'water', 'electricity', 'sanitation', 'streetlight', 'garbage', 'other'
  custom_category TEXT,            -- If category is 'other'
  description TEXT NOT NULL,

  -- Location
  location_text TEXT NOT NULL,     -- User-entered location description
  latitude DECIMAL(10, 8),         -- GPS latitude
  longitude DECIMAL(11, 8),        -- GPS longitude

  -- Status Tracking
  status TEXT DEFAULT 'pending',   -- 'pending', 'reviewing', 'resolved', 'closed'
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by TEXT
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);

-- Enable Row Level Security
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE (Anonymous) to INSERT
CREATE POLICY "Enable insert for everyone"
  ON issues
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to READ
CREATE POLICY "Enable read for authenticated"
  ON issues
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to UPDATE
CREATE POLICY "Enable update for authenticated"
  ON issues
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to DELETE
CREATE POLICY "Enable delete for authenticated"
  ON issues
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Issue Documents Table (for uploaded photos)
-- ============================================

CREATE TABLE IF NOT EXISTS issue_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,

  -- Document Info
  document_type TEXT NOT NULL,     -- 'issue_photo', 'aadhaar'
  document_name TEXT NOT NULL,

  -- Image Data
  image_data TEXT,                 -- Base64 encoded image
  file_size INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_issue_documents_issue_id ON issue_documents(issue_id);

-- Enable Row Level Security
ALTER TABLE issue_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE (Anonymous) to INSERT
CREATE POLICY "Enable insert for everyone"
  ON issue_documents
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to READ
CREATE POLICY "Enable read for authenticated"
  ON issue_documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- Gallery Images Table (for public gallery)
-- ============================================

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Title (bilingual, optional)
  title_en TEXT DEFAULT '',
  title_kn TEXT DEFAULT '',

  -- Image Data (base64 encoded)
  image_data TEXT NOT NULL,
  file_size INTEGER,
  compressed_size INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',

  -- Ordering and Status
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE to READ active images (public gallery)
CREATE POLICY "Enable public read for active images"
  ON gallery_images
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated users (Admins) to READ all images
CREATE POLICY "Enable full read for authenticated"
  ON gallery_images
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to INSERT
CREATE POLICY "Enable insert for authenticated"
  ON gallery_images
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to UPDATE
CREATE POLICY "Enable update for authenticated"
  ON gallery_images
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to DELETE
CREATE POLICY "Enable delete for authenticated"
  ON gallery_images
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- Settings Table (for app configuration)
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES ('whatsapp_number', '') ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE to READ settings (public)
CREATE POLICY "Enable public read for settings"
  ON settings
  FOR SELECT
  USING (true);

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to UPDATE
CREATE POLICY "Enable update for authenticated"
  ON settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to INSERT
CREATE POLICY "Enable insert for authenticated"
  ON settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Leaders Table (for public leaders page)
-- ============================================

CREATE TABLE IF NOT EXISTS leaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Name (bilingual, required)
  name_en TEXT NOT NULL,
  name_kn TEXT NOT NULL,

  -- Position/Title (bilingual, required)
  position_en TEXT NOT NULL,
  position_kn TEXT NOT NULL,

  -- Image Data (base64 encoded)
  image_data TEXT NOT NULL,
  file_size INTEGER,
  compressed_size INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',

  -- Category/Hierarchy Level: 'state', 'district', 'ward'
  category TEXT NOT NULL DEFAULT 'ward',

  -- Ordering and Status
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_leaders_order ON leaders(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_leaders_active ON leaders(is_active);
CREATE INDEX IF NOT EXISTS idx_leaders_category ON leaders(category);
CREATE INDEX IF NOT EXISTS idx_leaders_created_at ON leaders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE to READ active leaders (public page)
CREATE POLICY "Enable public read for active leaders"
  ON leaders
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated users (Admins) to READ all leaders
CREATE POLICY "Enable full read for authenticated"
  ON leaders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to INSERT
CREATE POLICY "Enable insert for authenticated"
  ON leaders
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to UPDATE
CREATE POLICY "Enable update for authenticated"
  ON leaders
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow ONLY AUTHENTICATED users (Admins) to DELETE
CREATE POLICY "Enable delete for authenticated"
  ON leaders
  FOR DELETE
  USING (auth.role() = 'authenticated');
