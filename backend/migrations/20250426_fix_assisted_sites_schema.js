/*
  # Fix Assisted Sites Schema to Match Form Fields

  1. Changes
    - Ensure developer_name is nullable
    - Ensure site_plan_document column exists
    - Ensure all required form fields have corresponding columns:
      - queries_contact_name
      - initial_eoi_date
      - bid_submission_date
      - manage_bids_process
    
  2. Notes
    - Uses DO block to check if columns exist before modifying
    - Keeps published_site_id as it's referenced in relationships
    - Makes all changes in a single migration for consistency
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Make developer_name nullable if it's not already
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'developer_name'
          AND is_nullable = 'NO'
        ) THEN 
          ALTER TABLE assisted_sites 
          ALTER COLUMN developer_name DROP NOT NULL;
        END IF;
  
        -- Add site_plan_document if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'site_plan_document'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN site_plan_document TEXT;
        END IF;
  
        -- Add queries_contact_name if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'queries_contact_name'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN queries_contact_name TEXT NOT NULL DEFAULT '';
        END IF;
  
        -- Add initial_eoi_date if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'initial_eoi_date'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN initial_eoi_date DATE;
        END IF;
  
        -- Add bid_submission_date if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'bid_submission_date'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN bid_submission_date DATE;
        END IF;
  
        -- Add manage_bids_process if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'manage_bids_process'
        ) THEN 
          ALTER TABLE assisted_sites 
          ADD COLUMN manage_bids_process BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Make developer_name NOT NULL again
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'developer_name'
          AND is_nullable = 'YES'
        ) THEN 
          -- First update any NULL values to empty string
          UPDATE assisted_sites 
          SET developer_name = '' 
          WHERE developer_name IS NULL;
          
          -- Then alter the column to NOT NULL
          ALTER TABLE assisted_sites 
          ALTER COLUMN developer_name SET NOT NULL;
        END IF;
  
        -- Remove added columns
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'queries_contact_name'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN queries_contact_name;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'initial_eoi_date'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN initial_eoi_date;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'bid_submission_date'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN bid_submission_date;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'manage_bids_process'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN manage_bids_process;
        END IF;
      END $$;
    `);
}
