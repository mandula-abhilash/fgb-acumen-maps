/*
  # Add user_id column

  1. Changes
    - Adds user_id column to live_opportunities table
    - Makes column NOT NULL
    
  2. Notes
    - Uses DO block to check if column exists before adding
    - Adds column with NOT NULL constraint
    - Removes mongo_user_id column since we'll use user_id instead
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Add user_id column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'user_id'
        ) THEN 
          ALTER TABLE live_opportunities 
          ADD COLUMN user_id TEXT NOT NULL;
        END IF;
  
        -- Drop mongo_user_id if it exists
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'live_opportunities' 
          AND column_name = 'mongo_user_id'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN mongo_user_id;
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
          AND column_name = 'user_id'
        ) THEN 
          ALTER TABLE live_opportunities 
          DROP COLUMN user_id;
  
          -- Restore mongo_user_id column
          ALTER TABLE live_opportunities 
          ADD COLUMN mongo_user_id TEXT;
        END IF;
      END $$;
    `);
}
