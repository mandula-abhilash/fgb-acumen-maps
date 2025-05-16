/*
  # Create Custom Regions Table

  1. New Tables
    - `custom_regions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (text)
      - `is_default` (boolean)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Notes
    - Default regions have user_id as NULL and is_default as true
    - Custom regions have user_id set and is_default as false
    - Unique constraint on name + user_id allows same names for different users
*/

export async function up(knex) {
  return knex.raw(`
    -- Create custom_regions table
    CREATE TABLE IF NOT EXISTS custom_regions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      user_id text,
      is_default boolean NOT NULL DEFAULT false,
      description text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(name, user_id)
    );

    -- Create indexes for faster lookups
    CREATE INDEX custom_regions_user_id_idx ON custom_regions(user_id);
    CREATE INDEX custom_regions_is_default_idx ON custom_regions(is_default);

    -- Insert default regions
    INSERT INTO custom_regions (name, is_default, description) VALUES
      ('North East', true, 'North East region of England'),
      ('North West', true, 'North West region of England'),
      ('Yorkshire and the Humber', true, 'Yorkshire and the Humber region'),
      ('East Midlands', true, 'East Midlands region of England'),
      ('West Midlands', true, 'West Midlands region of England'),
      ('East of England', true, 'East of England region'),
      ('London', true, 'London region'),
      ('South East', true, 'South East region of England'),
      ('South West', true, 'South West region of England')
    ON CONFLICT DO NOTHING;
  `);
}

export async function down(knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS custom_regions;
  `);
}
