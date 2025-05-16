/*
  # Add custom site address column

  1. Changes
    - Adds custom_site_address column to live_opportunities table
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Makes column NOT NULL with empty string default for existing rows
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'custom_site_address'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN custom_site_address TEXT NOT NULL DEFAULT '';
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
          AND column_name = 'custom_site_address'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN custom_site_address;
        END IF;
      END $$;
    `);
}
