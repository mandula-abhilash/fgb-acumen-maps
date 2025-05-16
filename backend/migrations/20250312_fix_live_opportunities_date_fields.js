/*
  # Fix Live Opportunities Fields

  1. Changes
    - Convert developer_region to text[] to store array of region IDs
    - Add first_handover_date and final_handover_date columns
    - Drop existing handover_date column
    - Standardize date format for all date columns
    
  2. Notes
    - Uses DO block to check if columns exist before modifying
    - Ensures all date columns use DATE type for consistency
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Convert developer_region to text array
        ALTER TABLE live_opportunities 
        ALTER COLUMN developer_region TYPE text[] USING 
          CASE 
            WHEN developer_region IS NULL THEN NULL
            WHEN developer_region::text = '[]' THEN '{}'::text[]
            ELSE string_to_array(trim(both '[]' from developer_region::text), ',')
          END;
  
        -- Add first_handover_date if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'first_handover_date'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN first_handover_date DATE;
        END IF;
  
        -- Add final_handover_date if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'final_handover_date'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN final_handover_date DATE;
        END IF;
  
        -- Copy existing handover_date to first_handover_date if it exists
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'handover_date'
        ) THEN 
          UPDATE live_opportunities 
          SET first_handover_date = handover_date::DATE
          WHERE handover_date IS NOT NULL;
  
          ALTER TABLE live_opportunities 
          DROP COLUMN handover_date;
        END IF;
  
        -- Ensure start_on_site_date is DATE type
        ALTER TABLE live_opportunities 
        ALTER COLUMN start_on_site_date TYPE DATE 
        USING start_on_site_date::DATE;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Revert developer_region back to JSON
        ALTER TABLE live_opportunities 
        ALTER COLUMN developer_region TYPE jsonb USING to_jsonb(developer_region);
  
        -- Add back handover_date
        ALTER TABLE live_opportunities 
        ADD COLUMN handover_date DATE;
  
        -- Copy first_handover_date back to handover_date
        UPDATE live_opportunities 
        SET handover_date = first_handover_date 
        WHERE first_handover_date IS NOT NULL;
  
        -- Drop new date columns
        ALTER TABLE live_opportunities 
        DROP COLUMN IF EXISTS first_handover_date,
        DROP COLUMN IF EXISTS final_handover_date;
      END $$;
    `);
}
