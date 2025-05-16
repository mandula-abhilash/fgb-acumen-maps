/*
  # Add site plan document field

  1. Changes
    - Adds site_plan_document column to live_opportunities table
    - Adds site_plan_document column to assisted_sites table
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Makes column nullable since it's optional
*/

export async function up(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Add site_plan_document column to live_opportunities if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'site_plan_document'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN site_plan_document TEXT;
          END IF;
  
          -- Add site_plan_document column to assisted_sites if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'assisted_sites' 
            AND column_name = 'site_plan_document'
          ) THEN 
            ALTER TABLE assisted_sites 
            ADD COLUMN site_plan_document TEXT;
          END IF;
        END $$;
      `);
}

export async function down(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Remove site_plan_document column from live_opportunities if it exists
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'site_plan_document'
          ) THEN 
            ALTER TABLE live_opportunities 
            DROP COLUMN site_plan_document;
          END IF;
  
          -- Remove site_plan_document column from assisted_sites if it exists
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'assisted_sites' 
            AND column_name = 'site_plan_document'
          ) THEN 
            ALTER TABLE assisted_sites 
            DROP COLUMN site_plan_document;
          END IF;
        END $$;
      `);
}
