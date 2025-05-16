/*
  # Add Planning Application Fields

  1. Changes
    - Adds planning_application_reference column to store unique reference numbers
    - Adds planning_application_url column to store planning application URLs
    
  2. Notes
    - Uses DO block to check if columns exist before adding
    - Makes columns nullable since they may not be available for all sites
*/

export async function up(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Add planning_application_reference column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'planning_application_reference'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN planning_application_reference VARCHAR(100);
  
            COMMENT ON COLUMN live_opportunities.planning_application_reference IS 'Unique planning application reference number';
          END IF;
  
          -- Add planning_application_url column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'planning_application_url'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN planning_application_url TEXT;
  
            COMMENT ON COLUMN live_opportunities.planning_application_url IS 'Full URL link to the planning application';
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
            AND column_name = 'planning_application_reference'
          ) THEN 
            ALTER TABLE live_opportunities 
            DROP COLUMN planning_application_reference;
          END IF;
  
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'planning_application_url'
          ) THEN 
            ALTER TABLE live_opportunities 
            DROP COLUMN planning_application_url;
          END IF;
        END $$;
      `);
}
