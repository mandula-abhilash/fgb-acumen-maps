/*
  # Add Site Files Columns

  1. Changes
    - Adds site_plan_image column to store site plan file URL
    - Adds proposed_specification column to store specification document URL
    - Adds s106_agreement column to store Section 106 agreement document URL
    - Adds vat_position column to store VAT status
    
  2. Notes
    - Uses DO block to check if columns exist before adding
    - Makes columns nullable since they are optional
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Add site_plan_image column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'site_plan_image'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN site_plan_image TEXT;
        END IF;
  
        -- Add proposed_specification column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'proposed_specification'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN proposed_specification TEXT;
        END IF;
  
        -- Add s106_agreement column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 's106_agreement'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN s106_agreement TEXT;
        END IF;
  
        -- Add vat_position column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'vat_position'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN vat_position TEXT;
        END IF;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Remove columns if they exist
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'site_plan_image'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN site_plan_image;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'proposed_specification'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN proposed_specification;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 's106_agreement'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN s106_agreement;
        END IF;
  
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'vat_position'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN vat_position;
        END IF;
      END $$;
    `);
}
