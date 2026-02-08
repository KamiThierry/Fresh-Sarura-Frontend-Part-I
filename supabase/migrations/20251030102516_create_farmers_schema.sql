/*
  # Create Farmers Management Schema

  ## Overview
  This migration creates the database structure for managing farmer registrations,
  profiles, and cooperative information for Fresh Sarura Export & Farmer Hub.

  ## New Tables
  
  ### `farmers`
  - `id` (uuid, primary key) - Unique identifier for each farmer
  - `full_name` (text, required) - Farmer's full name
  - `cooperative_name` (text, optional) - Name of the cooperative they belong to
  - `district` (text, required) - Administrative district location
  - `sector` (text, required) - Sector within the district
  - `produce_types` (text[], required) - Array of produce types (French Beans, Chilies, etc.)
  - `farm_size_hectares` (numeric, required) - Size of farm in hectares
  - `production_capacity_tons` (numeric, required) - Production capacity per season in tons
  - `phone` (text, required) - Contact phone number
  - `email` (text, optional) - Email address
  - `id_certificate_url` (text, optional) - URL to uploaded ID/certificate document
  - `status` (text, required) - Status: 'active' or 'inactive'
  - `photo_url` (text, optional) - URL to farmer's photo/avatar
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on `farmers` table
  - Add policies for authenticated users to:
    - Read all farmer records
    - Insert new farmer records
    - Update existing farmer records
    - Delete farmer records (admin only in future)

  ## Notes
  - Uses UUID for primary keys for better scalability
  - Produce types stored as array for flexibility
  - Status defaults to 'active' for new registrations
  - Timestamps track record lifecycle
*/

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cooperative_name text,
  district text NOT NULL,
  sector text NOT NULL,
  produce_types text[] NOT NULL DEFAULT '{}',
  farm_size_hectares numeric(10, 2) NOT NULL DEFAULT 0,
  production_capacity_tons numeric(10, 2) NOT NULL DEFAULT 0,
  phone text NOT NULL,
  email text,
  id_certificate_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read all farmers"
  ON farmers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert farmers"
  ON farmers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update farmers"
  ON farmers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete farmers"
  ON farmers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_farmers_full_name ON farmers(full_name);
CREATE INDEX IF NOT EXISTS idx_farmers_cooperative_name ON farmers(cooperative_name);
CREATE INDEX IF NOT EXISTS idx_farmers_status ON farmers(status);
CREATE INDEX IF NOT EXISTS idx_farmers_district ON farmers(district);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_farmers_updated_at ON farmers;
CREATE TRIGGER update_farmers_updated_at
  BEFORE UPDATE ON farmers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
