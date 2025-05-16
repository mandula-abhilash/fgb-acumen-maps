/*
  # Add Additional Site Dates and Admin Tracking Fields

  1. Changes
    - Add planning_submission_date (DATE)
    - Add planning_determination_date (DATE)
    - Add first_golden_brick_date (DATE)
    - Add final_golden_brick_date (DATE)
    - Add site_added_to_portal_date (DATE)
    
  2. Notes
    - Uses DO block to check if columns exist before adding
    - All date fields are nullable since they might not be available at submission
    - Adds appropriate indexes for date fields to improve query performance
    - Includes comments for each field
*/

export async function up(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Add planning_submission_date if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'planning_submission_date'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN planning_submission_date DATE;
  
            COMMENT ON COLUMN live_opportunities.planning_submission_date IS 'Date when planning application was submitted';
  
            CREATE INDEX idx_live_opportunities_planning_submission_date 
            ON live_opportunities(planning_submission_date);
          END IF;
  
          -- Add planning_determination_date if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'planning_determination_date'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN planning_determination_date DATE;
  
            COMMENT ON COLUMN live_opportunities.planning_determination_date IS 'Date when planning application was determined';
  
            CREATE INDEX idx_live_opportunities_planning_determination_date 
            ON live_opportunities(planning_determination_date);
          END IF;
  
          -- Add first_golden_brick_date if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'first_golden_brick_date'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN first_golden_brick_date DATE;
  
            COMMENT ON COLUMN live_opportunities.first_golden_brick_date IS 'Date of first golden brick completion';
  
            CREATE INDEX idx_live_opportunities_first_golden_brick_date 
            ON live_opportunities(first_golden_brick_date);
          END IF;
  
          -- Add final_golden_brick_date if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'final_golden_brick_date'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN final_golden_brick_date DATE;
  
            COMMENT ON COLUMN live_opportunities.final_golden_brick_date IS 'Date of final golden brick completion';
  
            CREATE INDEX idx_live_opportunities_final_golden_brick_date 
            ON live_opportunities(final_golden_brick_date);
          END IF;
  
          -- Add site_added_to_portal_date if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'site_added_to_portal_date'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN site_added_to_portal_date DATE;
  
            COMMENT ON COLUMN live_opportunities.site_added_to_portal_date IS 'Date when site was added to the portal (admin tracking)';
  
            CREATE INDEX idx_live_opportunities_site_added_to_portal_date 
            ON live_opportunities(site_added_to_portal_date);
          END IF;
        END $$;
      `);
}

export async function down(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Drop indexes first
          DROP INDEX IF EXISTS idx_live_opportunities_planning_submission_date;
          DROP INDEX IF EXISTS idx_live_opportunities_planning_determination_date;
          DROP INDEX IF EXISTS idx_live_opportunities_first_golden_brick_date;
          DROP INDEX IF EXISTS idx_live_opportunities_final_golden_brick_date;
          DROP INDEX IF EXISTS idx_live_opportunities_site_added_to_portal_date;
  
          -- Remove all new columns if they exist
          ALTER TABLE live_opportunities 
          DROP COLUMN IF EXISTS planning_submission_date,
          DROP COLUMN IF EXISTS planning_determination_date,
          DROP COLUMN IF EXISTS first_golden_brick_date,
          DROP COLUMN IF EXISTS final_golden_brick_date,
          DROP COLUMN IF EXISTS site_added_to_portal_date;
        END $$;
      `);
}
