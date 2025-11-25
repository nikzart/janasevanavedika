-- B Ravi Janaseva Vedika - Database Schema
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
  status TEXT DEFAULT 'pending',  -- 'pending', 'processed', 'rejected'
  admin_notes TEXT,

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
