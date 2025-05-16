/*
  # Create Assisted Sites Table

  1. New Tables
    - `assisted_sites`
      - `id` (uuid, primary key)
      - `site_name` (text)
      - `site_address` (text)
      - `custom_site_address` (text)
      - `opportunity_type` (text)
      - `developer_name` (text)
      - `plots` (integer)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `additional_info` (text)
      - `site_plan_image` (text)
      - `status` (text) - pending, processing, published, rejected
      - `published_site_id` (uuid) - Reference to live_opportunities table
      - `user_id` (text)
      - `coordinates` (point)
      - `boundary` (polygon)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Add status column to live_opportunities
    - Add status column to track site visibility (draft, published, withdrawn)
    - Default status is 'draft' until admin publishes
*/

export async function up(knex) {
  return knex.raw(`
      -- Create assisted_sites table
      CREATE TABLE IF NOT EXISTS assisted_sites (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        site_name text NOT NULL,
        site_address text NOT NULL,
        custom_site_address text NOT NULL,
        opportunity_type text NOT NULL,
        developer_name text NOT NULL,
        plots integer NOT NULL CHECK (plots > 0),
        contact_email text NOT NULL,
        contact_phone text,
        additional_info text,
        site_plan_image text,
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'rejected')),
        published_site_id uuid REFERENCES live_opportunities(id) ON DELETE SET NULL,
        user_id text NOT NULL,
        coordinates geometry(Point, 4326),
        boundary geometry(Polygon, 4326),
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
  
      -- Add status column to live_opportunities with default 'draft'
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'status'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN status text NOT NULL DEFAULT 'draft' 
          CHECK (status IN ('draft', 'published', 'withdrawn'));
  
          -- Update existing records to 'published' since they were created before this change
          UPDATE live_opportunities SET status = 'published' WHERE status = 'draft';
        END IF;
      END $$;
  
      -- Create indexes
      CREATE INDEX assisted_sites_user_id_idx ON assisted_sites(user_id);
      CREATE INDEX assisted_sites_status_idx ON assisted_sites(status);
      CREATE INDEX live_opportunities_status_idx ON live_opportunities(status);
    `);
}

export async function down(knex) {
  return knex.raw(`
      -- Drop indexes
      DROP INDEX IF EXISTS assisted_sites_user_id_idx;
      DROP INDEX IF EXISTS assisted_sites_status_idx;
      DROP INDEX IF EXISTS live_opportunities_status_idx;
  
      -- Remove status column from live_opportunities
      ALTER TABLE live_opportunities DROP COLUMN IF EXISTS status;
  
      -- Drop assisted_sites table
      DROP TABLE IF EXISTS assisted_sites;
    `);
}
