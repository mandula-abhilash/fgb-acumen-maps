/*
  # Drop developer_name Column from Assisted Sites Table

  1. Changes
    - Drops the developer_name column from assisted_sites table
    
  2. Notes
    - Uses DO block to check if column exists before dropping
    - Provides rollback capability to restore the column if needed
*/

export async function up(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Check if the column exists before dropping
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'developer_name'
        ) THEN 
          ALTER TABLE assisted_sites 
          DROP COLUMN developer_name;
        END IF;
      END $$;
    `);
}

export async function down(knex) {
  return knex.raw(`
      DO $$ 
      BEGIN 
        -- Check if the column doesn't exist before adding it back
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'assisted_sites' 
          AND column_name = 'developer_name'
        ) THEN 
          -- Add the column back as nullable
          ALTER TABLE assisted_sites 
          ADD COLUMN developer_name TEXT;
        END IF;
      END $$;
    `);
}
