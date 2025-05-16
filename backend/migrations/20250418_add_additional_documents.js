/*
  # Add Additional Documents Column

  1. Changes
    - Adds additional_documents column to live_opportunities table to store document information
    - Column type is JSONB to store an array of document objects with title and URL
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Stores documents in format: [{ title: string, url: string }]
*/

export async function up(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Add additional_documents column if it doesn't exist
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'additional_documents'
          ) THEN 
            ALTER TABLE live_opportunities 
            ADD COLUMN additional_documents JSONB DEFAULT '[]'::jsonb;
  
            COMMENT ON COLUMN live_opportunities.additional_documents IS 'Array of additional document objects with title and URL';
          END IF;
        END $$;
      `);
}

export async function down(knex) {
  return knex.raw(`
        DO $$ 
        BEGIN 
          -- Remove additional_documents column if it exists
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'live_opportunities' 
            AND column_name = 'additional_documents'
          ) THEN 
            ALTER TABLE live_opportunities 
            DROP COLUMN additional_documents;
          END IF;
        END $$;
      `);
}
