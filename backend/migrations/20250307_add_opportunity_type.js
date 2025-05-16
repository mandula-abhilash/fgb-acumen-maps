/*
  # Add opportunity type column

  1. Changes
    - Adds opportunity_type column to live_opportunities table
    - Makes column NOT NULL with default value 'section-106'
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Adds column with NOT NULL constraint and default value
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'opportunity_type'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN opportunity_type TEXT NOT NULL DEFAULT 'section-106';
        END IF;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'opportunity_type'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN opportunity_type;
        END IF;
      END $$;
    `);
}
