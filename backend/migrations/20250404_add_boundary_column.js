/*
  # Add boundary column to live_opportunities table

  1. Changes
    - Adds boundary column of type geometry(Polygon, 4326) to live_opportunities table
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Ensures PostGIS extension is enabled
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Ensure PostGIS extension is enabled
        CREATE EXTENSION IF NOT EXISTS "postgis";
  
        -- Add boundary column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'boundary'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN boundary geometry(Polygon, 4326);
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
          AND column_name = 'boundary'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN boundary;
        END IF;
      END $$;
    `);
}
